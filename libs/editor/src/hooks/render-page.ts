import { useEffect } from 'react';
import { pagesManager } from '::helpers/pages-manager/pages-manager';
import { ContentEditableProps } from '::helpers/pages-manager/helpers/render-page/render-page';

export const useRenderPage = (
  props: ContentEditableProps,
  loading: boolean,
) => {
  useEffect(() => {
    if (loading || !props.nodeId) {
      pagesManager.hideCurrentPage().catch(() => undefined);
    } else if (props.html) {
      pagesManager.render(props);
    }
  }, [loading, props.html, props.nodeId, props.images, props.editable]);
};
window['pm'] = pagesManager;
