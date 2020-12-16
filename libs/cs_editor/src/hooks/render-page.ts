import { useLayoutEffect } from 'react';
import {
  PagesManager,
  ContentEditableProps,
} from '::helpers/pages-manager/pages-manager';

export const pagesManager = new PagesManager();
export const useRenderPage = (
  props: ContentEditableProps,
  loading: boolean,
) => {
  useLayoutEffect(() => {
    if (!loading && props.nodeId) {
      pagesManager.render(props);
    }
  }, [loading, props.html, props.nodeId, props.images, props.updatedContentTs]);
};
window['pm'] = pagesManager;
