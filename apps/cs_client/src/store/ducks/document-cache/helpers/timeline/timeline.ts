import { applyPatches, Patch } from 'immer';
import { NumberOfFrames } from '::editor/helpers/snapback/snapback/snapback';

export const calculateNumberOfFrames = <T>(
  framePositions: number[],
  _position: number,
): NumberOfFrames => {
  const undoOffset =
    framePositions[0] === 0 || framePositions.length === 0 ? 0 : 1;
  const position = framePositions.indexOf(_position);
  const numberOfFrames = framePositions.length - 1;
  const redo = numberOfFrames - position;
  const undo = position + 1 - undoOffset;
  return { redo, undo };
};

export type TimelineFrameMeta<T> = {} & T;

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

export type TimelineOptions = { maximumNumberOfFrames: number };

export class Timeline<T, U> {
  get getPosition(): number {
    return this.position;
  }
  private position: number;
  private frames: Frames<T>;
  private readonly _onFrameChange: (frame?: Frame<T>) => void = noop;

  constructor(
    private options: TimelineOptions,
    onFrameChange?: OnFrameChange<T>,
  ) {
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
    this._onFrameChange();
  };

  private get numberOfFrames(): NumberOfFrames {
    return calculateNumberOfFrames<T>(
      Object.keys(this.frames).map(Number),
      this.position,
    );
  }

  private deleteFutureFrames = () => {
    let i = 1;
    do {
      delete this.frames[this.position + i];
      i += 1;
    } while (this.frames[this.position + i]);
  };

  private deleteOldFrames = () => {
    delete this.frames[this.position - this.options.maximumNumberOfFrames];
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
    this._onFrameChange();
  };

  redo = (state: U): U => {
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
  undo = (state: U): U => {
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

  getFramesMeta = (): [number, T][] => {
    return Object.entries(this.frames).map(([index, frame]) => [
      +index,
      frame.meta,
    ]);
  };
}
