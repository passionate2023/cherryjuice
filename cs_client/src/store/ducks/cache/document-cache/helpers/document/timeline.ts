import { applyPatches, Patch } from 'immer';
import { DocumentCacheState } from '::store/ducks/cache/document-cache';

type TimelineFrameMeta = {
  documentId: string;
};

type TimelineFrame = {
  redo: Patch[];
  undo: Patch[];
  meta: TimelineFrameMeta;
};

type TimelineFrames = {
  [position: number]: TimelineFrame;
};

export class DocumentMetaTimeline {
  private position: number;
  private frames: TimelineFrames;

  constructor() {
    this.position = -1;
    this.frames = {};
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
  };

  redo = (state: DocumentCacheState): DocumentCacheState => {
    const frame = this.frames[this.position + 1];
    if (!frame) return state;
    else {
      const patches: Patch[] = frame.redo;
      const newState = applyPatches(state, patches);
      this.position += 1;
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
      return newState;
    }
  };

  resetAll = () => {
    this.frames = {};
    this.position = -1;
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
  };
}
