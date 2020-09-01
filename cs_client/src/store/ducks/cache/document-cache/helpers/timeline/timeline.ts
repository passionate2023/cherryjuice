import { applyPatches, Patch } from 'immer';
import { DocumentCacheState } from '::store/ducks/cache/document-cache';
import {
  NumberOfFrames,
  OnFrameChange,
} from '::root/components/app/components/editor/tool-bar/components/groups/main-buttons/undo-redo/helpers/snapback/snapback/snapback';

type TimelineFrameMeta = {
  documentId: string;
  silent?: boolean;
};

type Frame = {
  redo: Patch[];
  undo: Patch[];
  meta: TimelineFrameMeta;
};

type Frames = {
  [position: number]: Frame;
};

const noop = () => undefined;

export class Timeline {
  private position: number;
  private frames: Frames;
  private readonly _onFrameChange: () => void = noop;

  constructor(onFrameChange?: OnFrameChange) {
    if (onFrameChange)
      this._onFrameChange = () => {
        setTimeout(() => {
          onFrameChange(this.numberOfFrames);
        }, 10);
      };
    this.position = -1;
    this.frames = {};
  }

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

  add = (meta: TimelineFrameMeta) => (
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
      this._onFrameChange();
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
      this._onFrameChange();
      return newState;
    }
  };

  resetAll = () => {
    this.frames = {};
    this.position = -1;
    this._onFrameChange();
  };

  resetDocument = (documentId: string) => {
    const originalFrames = Object.values(this.frames);
    const frames = originalFrames.filter(
      frame => frame.meta.documentId !== documentId,
    );
    this.frames = {};
    frames.forEach((frame, position) => {
      this.frames[position] = frame;
    });
    this.position -= originalFrames.length - frames.length;
    this._onFrameChange();
  };
}
