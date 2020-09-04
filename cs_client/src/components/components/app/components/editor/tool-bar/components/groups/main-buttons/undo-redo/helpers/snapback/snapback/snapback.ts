import { applyMutations } from '::root/components/app/components/editor/tool-bar/components/groups/main-buttons/undo-redo/helpers/snapback/snapback/helpers/apply-mutations';
import {
  detectMutationType,
  MutationType,
} from '::root/components/app/components/editor/tool-bar/components/groups/main-buttons/undo-redo/helpers/snapback/snapback/helpers/detect-mutation-type';
import { handleTextMutation } from '::root/components/app/components/editor/tool-bar/components/groups/main-buttons/undo-redo/helpers/snapback/snapback/helpers/handle-mutations/handle-text-mutation';

export type Frame = { mutations: EnhancedMutationRecord[]; type: MutationType };

type SnapBackState = {
  pointer: number;
  enabled: boolean;
  frames: Frame[];
};

export type EnhancedMutationRecord = MutationRecord & {
  newValue?: string;
};
export type NumberOfFrames = { undo: number; redo: number };
export type OnFrameChange = (frames: NumberOfFrames) => void;
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
    private elementGetter: ElementGetter,
    onFrameChange: OnFrameChange,
  ) {
    this.onFrameChange = () => {
      onFrameChange(this.numberOfFrames);
    };
    this.observer = new MutationObserver(this.handleMutations);
    this.reset();
  }

  private get latestFrame(): Frame {
    return this.state.frames[this.state.frames.length - 1];
  }
  private get numberOfFrames(): NumberOfFrames {
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
        this.addFrame({ mutations, type });
      }
    }
  };

  private addFrame = ({ type, mutations }: Frame): void => {
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
      });
      this.state.pointer = this.state.frames.length - 1;
      this.onFrameChange();
    }
  };

  private applyFrame = (
    mutations: EnhancedMutationRecord[],
    undo = false,
  ): void => {
    this.disable();
    applyMutations(mutations, undo);
    this.enable();
  };

  redo = (): void => {
    if (this.state.enabled && this.numberOfFrames.redo) {
      const mutations = this.state.frames[++this.state.pointer].mutations;
      this.applyFrame(mutations, false);
      this.onFrameChange();
    }
  };

  undo = (): void => {
    if (this.state.enabled && this.numberOfFrames.undo) {
      const mutations = this.state.frames[this.state.pointer--].mutations
        .slice(0)
        .reverse();
      this.applyFrame(mutations, true);
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
        this.elementGetter().then(element => {
          this.observer.observe(element, this.options);
          this.onFrameChange();
        });
      }
    }, delay);
  };
}
