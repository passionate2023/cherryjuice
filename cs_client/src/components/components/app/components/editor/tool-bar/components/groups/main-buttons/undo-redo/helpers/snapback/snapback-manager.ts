import {
  ElementGetter,
  OnFrameChange,
  SnapBack,
} from '::root/components/app/components/editor/tool-bar/components/groups/main-buttons/undo-redo/helpers/snapback/snapback/snapback';
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

  setCurrent = (id: string): void => {
    if (!this.snapBacks[id]) {
      this.snapBacks[id] = new SnapBack(
        id,
        mutationObserverOptions,
        this.elementGetter,
        this.onFrameChange,
      );
    }
    Object.values(this.snapBacks).forEach(snapBack => {
      snapBack.disable();
    });
    this.current = this.snapBacks[id];
    if (process.env.NODE_ENV === 'development') {
      // @ts-ignore
      window.snapBack = this.current;
    }
    this.current.resetState();
    this.current.enable();
  };
}
