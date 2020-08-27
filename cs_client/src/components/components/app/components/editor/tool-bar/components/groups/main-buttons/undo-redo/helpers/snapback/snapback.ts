type EnhancedMutationRecord = MutationRecord & {
  newValue?: string;
};
type NextFrame = {
  formatting: boolean;
  mutations: (EnhancedMutationRecord | EnhancedMutationRecord[])[];
};

type Frame = { mutations: EnhancedMutationRecord[] };

const removeNode = (node: Node): void => {
  node.parentNode.removeChild(node);
};

const insertSibling = (nextSibling: HTMLElement) => (node: Node) => {
  nextSibling.parentNode.insertBefore(node, nextSibling);
};

const insertChild = (target: HTMLElement) => (node: Node) => {
  target.appendChild(node);
};

export type NumberOfFrames = { undo: number; redo: number };
export type OnFrameChange = (frames: NumberOfFrames) => void;

export type ElementGetter = () => Promise<HTMLDivElement>;

// inspired from https://github.com/lohfu/snapback
export class SnapBack {
  private observer;
  private enabled = false;
  private framePointer: number;
  private frames: Frame[];
  private nextFrame: NextFrame;
  constructor(
    private id: string,
    private options: MutationObserverInit,
    private elementGetter: ElementGetter,
    private onFrameChange: OnFrameChange,
  ) {
    this.observer = new MutationObserver(mutations => {
      if (this.enabled) {
        // eslint-disable-next-line no-console
        if (process.env.NODE_ENV === 'development') console.log(mutations);

        if (this.nextFrame.formatting) {
          this.nextFrame.mutations.push(mutations);
          this.saveFrame();
          this.nextFrame.formatting = false;
        } else mutations.forEach(this.addMutation);
      }
    });
    this.resetFrames();
  }

  disable = (): void => {
    this.observer.disconnect();
    this.enabled = false;
  };

  resetFrames = (): void => {
    this.nextFrame = {
      formatting: false,
      mutations: [],
    };
    this.frames = [];
    this.framePointer = -1;
  };

  enable = (): void => {
    if (!this.enabled) {
      this.enabled = true;
      this.elementGetter().then(element => {
        this.observer.observe(element, this.options);
        this.onFrameChange(this.numberOfFrames);
      });
    }
  };

  formattingStarted = (): void => {
    this.nextFrame.formatting = true;
    this.saveFrame();
  };

  addMutation = (mutation: EnhancedMutationRecord): void => {
    {
      let previousMutation;
      if (mutation.type === 'characterData') {
        const newValue: string = mutation.target.textContent;
        previousMutation = this.nextFrame.mutations[
          this.nextFrame.mutations.length - 1
        ];
        const textMutationOnSameNode =
          previousMutation &&
          previousMutation.type === 'characterData' &&
          previousMutation.target === mutation.target &&
          previousMutation.newValue === mutation.oldValue;
        if (textMutationOnSameNode) {
          previousMutation.newValue = newValue;
        } else {
          mutation.newValue = newValue;
          this.nextFrame.mutations.push(mutation);
          if (/.+[\s,.]$/.test(newValue)) this.saveFrame();
        }
      } else if (
        mutation.type === 'attributes' &&
        mutation.target.nodeType === Node.ELEMENT_NODE
      ) {
        mutation.newValue = (mutation.target as HTMLElement).getAttribute(
          mutation.attributeName,
        );
        if (String(mutation.newValue) !== String(mutation.newValue)) {
          this.nextFrame.mutations.push(mutation);
          this.saveFrame();
        }
      } else if (mutation.type === 'childList') {
        this.nextFrame.mutations.push(mutation);
        this.saveFrame();
      }
    }
  };

  saveFrame = (): void => {
    const nextFrameHasMutations = this.nextFrame.mutations.length > 0;
    if (nextFrameHasMutations) {
      const obsoleteFutureFrames = this.framePointer < this.frames.length - 1;
      if (obsoleteFutureFrames) {
        this.frames = this.frames.slice(0, this.framePointer + 1);
      }

      this.frames.push({
        mutations: this.nextFrame.mutations.flatMap(x => x),
      });
      this.nextFrame.mutations = [];
      this.framePointer = this.frames.length - 1;
      this.onFrameChange(this.numberOfFrames);
    }
  };

  get numberOfFrames(): NumberOfFrames {
    const numberOfFrames = this.frames.length - 1;
    const redo = numberOfFrames - this.framePointer;
    const undo = this.framePointer >= 0 ? this.framePointer : 0;
    return { redo, undo };
  }

  redo = () => {
    if (this.enabled && this.numberOfFrames.redo) {
      const mutations = this.frames[++this.framePointer].mutations;
      this.applyFrame(mutations, false);
      this.onFrameChange(this.numberOfFrames);
    }
  };

  undo = () => {
    this.saveFrame();
    if (this.enabled && this.numberOfFrames.undo) {
      const mutations = this.frames[this.framePointer--].mutations
        .slice(0)
        .reverse();
      this.applyFrame(mutations, true);
      this.onFrameChange(this.numberOfFrames);
    }
  };

  applyFrame = (mutations: EnhancedMutationRecord[], undo = false) => {
    this.disable();

    mutations.forEach(mutation => {
      const target = mutation.target as HTMLElement;
      if (mutation.type === 'characterData') {
        mutation.target.textContent = undo
          ? mutation.oldValue
          : mutation.newValue;
      } else if (mutation.type === 'attributes') {
        const value = (undo ? mutation.oldValue : mutation.newValue) as
          | string
          | boolean
          | number;
        if (value || value === false || value === 0) {
          target.setAttribute(mutation.attributeName, String(value));
        } else {
          target.removeAttribute(mutation.attributeName);
        }
      } else if (mutation.type === 'childList') {
        const addNodes: NodeList = undo
          ? mutation.removedNodes
          : mutation.addedNodes;
        const removeNodes: NodeList = undo
          ? mutation.addedNodes
          : mutation.removedNodes;
        const nextSibling = mutation.nextSibling as HTMLElement;

        Array.from(addNodes).forEach(
          nextSibling
            ? insertSibling(nextSibling)
            : insertChild(target as HTMLElement),
        );

        Array.from(removeNodes).forEach(removeNode);
      }
    });

    this.enable();
  };
}
