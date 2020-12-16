import {
  NumberOfFrames,
  OnFrameChange,
  SnapBack,
} from '::helpers/snapback/snapback/snapback';
export const mutationObserverOptions: MutationObserverInit = {
  attributes: true,
  characterData: true,
  subtree: true,
  childList: true,
  attributeOldValue: true,
  characterDataOldValue: true,
};
export class SnapBackManager {
  private readonly snapBacks: { [id: string]: SnapBack } = {};
  current: SnapBack;
  private onFrameChange: OnFrameChange;
  getCurrentFrameTS = (id: string): number =>
    this.snapBacks[id]?.currentFrameTs;
  setOnFrameChange(onFrameChange: OnFrameChange): void {
    this.onFrameChange = onFrameChange;
  }

  disableAll = () => {
    Object.values(this.snapBacks).forEach(snapBack => {
      snapBack.disable();
    });
  };

  resetAll = () => {
    Object.values(this.snapBacks).forEach(snapBack => {
      snapBack.reset();
    });
  };

  setCurrent = (id: string): void => {
    if (!this.snapBacks[id]) {
      this.snapBacks[id] = new SnapBack(
        id,
        mutationObserverOptions,
        this.onFrameChange,
      );
    }
    if (this.current) this.current.disable();

    this.current = this.snapBacks[id];
    this.current.enable();
  };

  reset(nodeId: string) {
    if (this.snapBacks[nodeId]) {
      this.snapBacks[nodeId].reset();
      this.snapBacks[nodeId].enable();
    }
  }
}
