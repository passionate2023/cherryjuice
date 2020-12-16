import { useEffect } from 'react';
import {
  ContentEditableProps,
  pagesManager,
} from '::helpers/pages-manager/pages-manager';

export const useRenderPage = (
  props: ContentEditableProps,
  loading: boolean,
) => {
  useEffect(() => {
    if (!loading && props.nodeId) {
      pagesManager.render(props);
    }
  }, [loading, props.html, props.nodeId, props.images]);
};
window['pm'] = pagesManager;
