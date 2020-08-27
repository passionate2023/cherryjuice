import {
  endsWithDelimiter,
  isMutationOnPreviousNode,
  removeDelimiter,
} from '::root/components/app/components/editor/tool-bar/components/groups/main-buttons/undo-redo/helpers/snapback/snapback/helpers/character-data';
import { applyMutations } from '::root/components/app/components/editor/tool-bar/components/groups/main-buttons/undo-redo/helpers/snapback/snapback/helpers/apply-mutations';

type Frame = { mutations: EnhancedMutationRecord[] };

type SnapBackState = {
  formatting: boolean;
  framePointer: number;
  enabled: boolean;
  frames: Frame[];
};

export type EnhancedMutationRecord = MutationRecord & {
  newValue?: string;
};
export type NumberOfFrames = { undo: number; redo: number };
export type OnFrameChange = (frames: NumberOfFrames) => void;
export type ElementGetter = () => Promise<HTMLDivElement>;

// inspired from https://github.com/lohfu/snapback
export class SnapBack {
  private observer;
  private state: SnapBackState;
  constructor(
    private id: string,
    private options: MutationObserverInit,
    private elementGetter: ElementGetter,
    private onFrameChange: OnFrameChange,
  ) {
    this.observer = new MutationObserver(this.handleMutations);
    this.resetState();
  }

  private get latestFrame(): EnhancedMutationRecord[] {
    return this.state.frames[this.state.frames.length - 1]?.mutations || [];
  }
  private get numberOfFrames(): NumberOfFrames {
    const numberOfFrames = this.state.frames.length - 1;
    const redo = numberOfFrames - this.state.framePointer;
    const undo = this.state.framePointer + 1;
    return { redo, undo };
  }

  private handleMutations = (mutations: MutationRecord[]): void => {
    if (this.state.enabled) {
      // eslint-disable-next-line no-console
      if (process.env.NODE_ENV === 'development') console.log(mutations);

      if (this.state.formatting) {
        this.saveFrame(mutations);
        this.state.formatting = false;
      } else mutations.forEach(this.addMutation);
    }
  };

  private addMutation = (mutation: EnhancedMutationRecord): void => {
    if (mutation.type === 'characterData') {
      mutation.newValue = mutation.target.textContent;
      const latestFrame = this.latestFrame;
      const latestMutation = latestFrame[latestFrame.length - 1];
      const valueEndsWithDelimiter = endsWithDelimiter(mutation.newValue);
      const { additiveMutation, noopMutation } = isMutationOnPreviousNode(
        latestMutation,
        mutation,
      );

      if (noopMutation) {
        return;
      } else if (additiveMutation && !valueEndsWithDelimiter)
        latestMutation.newValue = mutation.newValue;
      else if (additiveMutation && valueEndsWithDelimiter) {
        mutation.newValue = removeDelimiter(mutation.newValue);
        latestMutation.newValue = mutation.newValue;
        this.saveFrame([]);
      } else {
        this.saveFrame([mutation]);
      }
    } else if (
      mutation.type === 'attributes' &&
      mutation.target.nodeType === Node.ELEMENT_NODE &&
      mutation.attributeName !== 'data-edited'
    ) {
      mutation.newValue = (mutation.target as HTMLElement).getAttribute(
        mutation.attributeName,
      );
      if (String(mutation.oldValue) !== String(mutation.newValue)) {
        this.saveFrame([mutation]);
      }
    } else if (mutation.type === 'childList') {
      const frame = this.latestFrame;
      frame.push(mutation);
    }
  };

  private saveFrame = (mutations: EnhancedMutationRecord[]): void => {
    const nextFrameHasMutations = mutations.length > 0;
    if (nextFrameHasMutations) {
      const obsoleteFutureFrames =
        this.state.framePointer < this.state.frames.length - 1;
      if (obsoleteFutureFrames) {
        this.state.frames = this.state.frames.slice(
          0,
          this.state.framePointer + 1,
        );
      }

      this.state.frames.push({
        mutations: mutations.flatMap(x => x),
      });
      // this.nextFrame.mutations = [];
      this.state.framePointer = this.state.frames.length - 1;
      this.onFrameChange(this.numberOfFrames);
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
      const mutations = this.state.frames[++this.state.framePointer].mutations;
      this.applyFrame(mutations, false);
      this.onFrameChange(this.numberOfFrames);
    }
  };

  undo = (): void => {
    if (this.state.enabled && this.numberOfFrames.undo) {
      const mutations = this.state.frames[this.state.framePointer--].mutations
        .slice(0)
        .reverse();
      this.applyFrame(mutations, true);
      this.onFrameChange(this.numberOfFrames);
    }
  };

  resetState = (): void => {
    this.state = {
      formatting: false,
      enabled: false,
      framePointer: -1,
      frames: [],
    };
  };

  disable = (): void => {
    this.observer.disconnect();
    this.state.enabled = false;
  };

  enable = (): void => {
    if (!this.state.enabled) {
      this.state.enabled = true;
      this.elementGetter().then(element => {
        this.observer.observe(element, this.options);
        this.onFrameChange(this.numberOfFrames);
        element.focus();
      });
    }
  };

  formattingStarted = (): void => {
    this.state.formatting = true;
  };
}
