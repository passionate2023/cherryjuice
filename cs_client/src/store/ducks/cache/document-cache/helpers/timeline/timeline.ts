import { applyPatches, Patch } from 'immer';
import { DocumentCacheState } from '::store/ducks/cache/document-cache';
import { NumberOfFrames } from '::root/components/app/components/editor/tool-bar/components/groups/main-buttons/undo-redo/helpers/snapback/snapback/snapback';

export type TimelineFrameMeta<T> = {
  silent?: boolean;
} & T;

export type Frame<T> = {
  redo: Patch[];
  undo: Patch[];
  meta: TimelineFrameMeta<T>;
};

export type Frames<T> = {
  [position: number]: Frame<T>;
};
export type OnFrameChange<T> = (
  frames: NumberOfFrames,
  frame: Frame<T>,
) => void;
const noop = () => undefined;

export type PersistedFrame<T> = {
  frames: Frames<T>;
  position: number;
};

export class Timeline<T> {
  private position: number;
  private frames: Frames<T>;
  private readonly _onFrameChange: (frame?: Frame<T>) => void = noop;

  constructor(onFrameChange?: OnFrameChange<T>) {
    if (onFrameChange)
      this._onFrameChange = (frame): void => {
        setTimeout(() => {
          onFrameChange(this.numberOfFrames, frame);
        }, 10);
      };
    this.position = -1;
    this.frames = {};
  }

  reHydrate = ({ position, frames }: PersistedFrame<T>): void => {
    this.position = position;
    this.frames = frames;
  };

  private get numberOfFrames(): NumberOfFrames {
    const numberOfFrames = Object.keys(this.frames).length - 1;
    const redo = numberOfFrames - this.position;
    const undo = this.position + 1;
    return { redo, undo };
  }

  private deleteFutureFrames = () => {
    let i = 1;
    do {
      delete this.frames[this.position + i];
      i += 1;
    } while (this.frames[this.position + i]);
  };

  private deleteOldFrames = () => {
    delete this.frames[this.position - 4];
  };

  add = (meta: TimelineFrameMeta<T>) => (
    patches: Patch[],
    reversePatches: Patch[],
  ): void => {
    this.frames[++this.position] = {
      redo: patches,
      undo: reversePatches,
      meta,
    };
    this.deleteFutureFrames();
    this.deleteOldFrames();
    if (!meta.silent) this._onFrameChange();
  };

  redo = (state: DocumentCacheState): DocumentCacheState => {
    const frame = this.frames[this.position + 1];
    if (!frame) return state;
    else {
      const patches: Patch[] = frame.redo;
      const newState = applyPatches(state, patches);
      this.position += 1;
      this._onFrameChange(frame);
      return newState;
    }
  };
  undo = (state: DocumentCacheState): DocumentCacheState => {
    const frame = this.frames[this.position];
    if (!frame) return state;
    else {
      const patches: Patch[] = frame.undo;
      const newState = applyPatches(state, patches);
      this.position -= 1;
      this._onFrameChange(frame);
      return newState;
    }
  };

  resetAll = () => {
    this.frames = {};
    this.position = -1;
    this._onFrameChange();
  };

  removeFrames = (predicate: (frame: Frame<T>) => boolean) => {
    const originalFrames = Object.values(this.frames);
    const frames = originalFrames.filter(frame => !predicate(frame));
    this.frames = {};
    frames.forEach((frame, position) => {
      this.frames[position] = frame;
    });
    this.position -= originalFrames.length - frames.length;
    this._onFrameChange();
  };

  getFramesMeta = (): T[] => {
    return Object.values(this.frames).map(frame => frame.meta);
  };
}
