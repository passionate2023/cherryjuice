import { getEditorContainer } from '::helpers/pages-manager/helpers/get-editor';
import {
  createContentEditable,
  PageProps,
} from '::helpers/pages-manager/helpers/render-page/create-content-editable';
import { OnFrameChange, SnapBack } from '::helpers/snapback/snapback/snapback';
import { mutationObserverOptions } from '::helpers/snapback/snapback/helpers/mutation-observer-options';
import { attachPageImages } from '::helpers/pages-manager/helpers/render-page/attach-page-images';
import { ScrollIntoHash } from '::helpers/pages-manager/helpers/scroll-into-hash';
import { Image } from '@cherryjuice/graphql-types';

export type Page = {
  element: HTMLDivElement;
  snapBack: SnapBack;
  lastSavedFrameTs: number;
  scrollPosition: [number, number];
};
export type ContentEditableProps = PageProps & {
  focusOnUpdate: boolean;
  scrollPosition: [number, number];
  images: Image[];
};

export type RenderPageProps = {
  page: Page;
  hidePage: () => Promise<void>;
  restorePage: (id: string) => void;
  onFrameChange: OnFrameChange;
};
const scrollIntoHash = new ScrollIntoHash();
export const renderPage = (
  {
    focusOnUpdate,
    scrollPosition = [0, 0],
    nodeId,
    editable,
    html,
    images,
  }: ContentEditableProps,
  { hidePage, onFrameChange, page, restorePage }: RenderPageProps,
): Page => {
  const editor = getEditorContainer();
  const contentEditable = editor.firstElementChild as HTMLDivElement;
  const renderedNodeId = contentEditable?.dataset?.nodeId;
  const queriedNodeIsCached = page?.element;
  const queriedNodeIsRendered = renderedNodeId === nodeId;
  const somePageIsRendered = !!renderedNodeId;
  if (!(queriedNodeIsRendered && queriedNodeIsCached)) {
    if (somePageIsRendered) hidePage();
    if (queriedNodeIsCached) restorePage(nodeId);
    else {
      editor.innerHTML = createContentEditable({
        nodeId,
        html,
        editable,
      });
      const element = editor.firstElementChild as HTMLDivElement;
      page = {
        element: element,
        snapBack: new SnapBack(
          nodeId,
          mutationObserverOptions,
          onFrameChange,
          element,
        ),
        lastSavedFrameTs: 0,
        scrollPosition,
      };
    }
    page.snapBack.enable();
  }
  attachPageImages(editor, images);
  if (focusOnUpdate) page.element.focus();
  page.element.scrollTo(...page.scrollPosition);
  scrollIntoHash.scroll();
  return page;
};
