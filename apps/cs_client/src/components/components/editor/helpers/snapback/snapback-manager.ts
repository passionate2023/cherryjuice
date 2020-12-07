import {
  ElementGetter,
  OnFrameChange,
  SnapBack,
} from '::root/components/editor/helpers/snapback/snapback/snapback';
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
  private elementGetter: ElementGetter;
  private onFrameChange: OnFrameChange;

  setElementGetter(elementGetter: ElementGetter): void {
    this.elementGetter = elementGetter;
  }
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
        this.elementGetter,
        this.onFrameChange,
      );
    }
    this.disableAll();
    this.current = this.snapBacks[id];
    this.current.reset();
    this.current.enable();
  };
}
