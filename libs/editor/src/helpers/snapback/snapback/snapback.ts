import { applyMutations } from '::helpers/snapback/snapback/helpers/apply-mutations';
import {
  detectMutationType,
  MutationType,
} from '::helpers/snapback/snapback/helpers/detect-mutation-type';
import { handleTextMutation } from '::helpers/snapback/snapback/helpers/handle-mutations/handle-text-mutation';
import { restoreCaret } from '::helpers/snapback/snapback/helpers/restore-caret/restore-caret';
export type Frame = {
  mutations: EnhancedMutationRecord[];
  type: MutationType;
  ts: number;
};

type SnapBackState = {
  pointer: number;
  enabled: boolean;
  frames: Frame[];
};

export type EnhancedMutationRecord = MutationRecord & {
  newValue?: string;
};
export type NumberOfFrames = { undo: number; redo: number };
export type OnFrameChange = (
  frames: NumberOfFrames,
  meta: { id: string; currentFrameTs: number },
) => void;
export type ElementGetter = () => Promise<HTMLDivElement>;

const assignValue = (mrs: EnhancedMutationRecord[]): void =>
  mrs.forEach(mr => {
    if (mr.type === 'characterData') mr.newValue = mr.target.textContent;
    else if (mr.type === 'attributes')
      mr.newValue = (mr.target as HTMLElement).getAttribute(mr.attributeName);
  });

// inspired from https://github.com/lohfu/snapback
export class SnapBack {
  private observer;
  private state: SnapBackState;
  private readonly onFrameChange: () => void;

  constructor(
    private id: string,
    private options: MutationObserverInit,
    // private elementGetter: ElementGetter,
    onFrameChange: OnFrameChange,
    private element: HTMLElement,
  ) {
    this.onFrameChange = () => {
      onFrameChange(this.numberOfFrames, {
        id,
        currentFrameTs: this.currentFrameTs,
      });
    };
    this.observer = new MutationObserver(this.handleMutations);
    this.reset();
  }

  private get latestFrame(): Frame {
    return this.state.frames[this.state.frames.length - 1];
  }
  get currentFrameTs(): number {
    return this.state.frames[this.state.pointer]?.ts;
  }
  get numberOfFrames(): NumberOfFrames {
    const numberOfFrames = this.state.frames.length - 1;
    const redo = numberOfFrames - this.state.pointer;
    const undo = this.state.pointer + 1;
    return { redo, undo };
  }

  private handleMutations = (mutations: MutationRecord[]): void => {
    if (this.state.enabled) {
      assignValue(mutations);
      const type = detectMutationType(mutations);
      if (type === MutationType.text) {
        mutations.forEach(mutation => {
          const nextFrame = handleTextMutation(mutation, this.latestFrame);
          if (nextFrame) this.addFrame(nextFrame);
        });
      } else if (type === MutationType.pastedImageMeta) {
        const latestFrame = this.latestFrame;
        if (latestFrame?.type === MutationType.pasting)
          latestFrame.mutations.push(...mutations);
      } else if (type) {
        this.addFrame({ mutations, type, ts: Date.now() });
      }
    }
  };

  private addFrame = ({ type, mutations, ts }: Frame): void => {
    const nextFrameHasMutations = mutations.length > 0;
    if (nextFrameHasMutations) {
      const obsoleteFutureFrames =
        this.state.pointer < this.state.frames.length - 1;
      if (obsoleteFutureFrames) {
        this.state.frames = this.state.frames.slice(0, this.state.pointer + 1);
      }

      this.state.frames.push({
        mutations: mutations.flatMap(x => x),
        type,
        ts,
      });
      this.state.pointer = this.state.frames.length - 1;
      this.onFrameChange();
    }
  };

  private applyFrame = (
    mutations: EnhancedMutationRecord[],
    type: MutationType,
    undo = false,
  ): void => {
    this.disable();
    applyMutations(mutations, undo);
    restoreCaret(mutations, type, undo);
    this.enable();
  };

  redo = (): void => {
    if (this.state.enabled && this.numberOfFrames.redo) {
      const frame = this.state.frames[++this.state.pointer];
      this.applyFrame(frame.mutations, frame.type, false);
      this.onFrameChange();
    }
  };

  undo = (): void => {
    if (this.state.enabled && this.numberOfFrames.undo) {
      const frame = this.state.frames[this.state.pointer--];
      const mutations = frame.mutations.slice(0).reverse();
      this.applyFrame(mutations, frame.type, true);
      this.onFrameChange();
    }
  };

  reset = (): void => {
    this.state = {
      enabled: false,
      pointer: -1,
      frames: [],
    };
    this.onFrameChange();
  };

  disable = (): void => {
    this.observer.disconnect();
    this.state.enabled = false;
  };

  enable = (delay = 0): void => {
    setTimeout(() => {
      if (!this.state.enabled) {
        this.state.enabled = true;
        this.observer.observe(this.element, this.options);
      }
    }, delay);
    this.onFrameChange();
  };
  get ID() {
    return this.id;
  }
}
