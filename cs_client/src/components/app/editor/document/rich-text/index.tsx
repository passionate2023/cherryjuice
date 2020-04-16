import * as React from 'react';
import { useEffect, useRef } from 'react';
import { useRouteMatch } from 'react-router';
import { useMutation } from '@apollo/react-hooks';
import { QUERY_NODE_CONTENT } from '::graphql/queries';
import { usePng } from '::hooks/use-png';
import { SpinnerCircle } from '::shared-components/spinner-circle';
import { MUTATE_CT_NODE_CONTENT } from '::graphql/mutations';
import { getAHtml__legacy } from '::helpers/html-to-ctb';
import { setupClipboard } from '::helpers/clipboard';
import { setupKeyboardEvents } from '::helpers/typing';
import {
  hotKeysManager,
  setupDevHotKeys,
  setupFormattingHotKeys,
} from '::helpers/hotkeys';
import { useReloadQuery } from '::hooks/use-reload-query';

import { modRichText } from '::sass-modules/index';
import { useQueryTimeout } from '::hooks/use-query-timeout';
import { useReactRouterForAnchors } from '::hooks/use-react-router-for-anchors';
import { useScrollToHashElement } from '::hooks/use-scroll-to-hash-element';
import { appActionCreators } from '::app/reducer';
import { NodeMeta } from '::types/generated';
import { setupHandleGesture } from '::shared-components/drawer/drawer-navigation/helpers';

type Props = {
  file_id: string;
  saveDocument: number;
  reloadDocument: number;
  contentEditable: boolean;
  nodes: Map<number, NodeMeta>;
  processLinks: number;
};

const RichText: React.FC<Props> = ({
  file_id,
  saveDocument,
  reloadDocument,
  contentEditable,
  nodes,
  processLinks,
}) => {
  const richTextRef = useRef<HTMLDivElement>();
  const match = useRouteMatch();
  // @ts-ignore
  const node_id = Number(match.params?.node_id);
  const toolbarQueuesRef = useRef({});
  const queryVariables = { file_id, node_id: node_id };
  let { data, error } = useReloadQuery(
    {
      reloadRequestID: reloadDocument,
    },
    {
      query: QUERY_NODE_CONTENT.html.query,
      queryVariables,
    },
  );
  useQueryTimeout(
    {
      queryData: data,
      queryError: error,
      queryVariables,
    },
    { resourceName: 'the node' },
  );
  let html, node;
  node = QUERY_NODE_CONTENT.html.path(data);
  if (node && node.node_id === node_id) {
    html = node.html;
    processLinks = new Date().getTime();
  }

  const all_png_base64 = usePng({
    file_id,
    node_id,
    offset: undefined,
  });
  if (html && all_png_base64?.node_id === node_id && richTextRef.current) {
    let counter = 0;
    while (all_png_base64.pngs[counter] && /<img src=""/.test(html)) {
      html = html.replace(
        /<img src=""/,
        `<img src="data:image/png;base64,${all_png_base64.pngs[counter++]}"`,
      );
    }
    processLinks = new Date().getTime();
  }
  const [mutate] = useMutation(MUTATE_CT_NODE_CONTENT.html);

  if (saveDocument && !toolbarQueuesRef.current[saveDocument]) {
    toolbarQueuesRef.current[saveDocument] = true;
    const containers = Array.from(
      document.querySelectorAll('#rich-text > div'),
    );
    const { abstractHtml } = getAHtml__legacy({ containers });
    if (!(saveDocument + '').endsWith('_'))
      mutate({
        variables: {
          file_id: file_id || '',
          node_id,
          abstract_html: abstractHtml,
        },
      });
  }

  useEffect(() => {
    setupClipboard();
    setupKeyboardEvents();
    setupFormattingHotKeys();
    setupDevHotKeys();
    hotKeysManager.startListening();
  }, []);

  useReactRouterForAnchors({ file_id, processLinks });
  useScrollToHashElement({ html });

  useEffect(() => {
    const node = nodes?.get(node_id);
    if (node) {
      const {
        name,
        node_title_styles,
        is_richtxt,
        ts_creation,
        ts_lastsave,
      } = node;
      appActionCreators.selectNode(
        {
          node_id,
          name,
          style: node_title_styles,
        },
        {
          is_richtxt,
          ts_creation,
          ts_lastsave,
        },
      );
    }
  }, [node_id, nodes]);
  useEffect(() => {
    setupHandleGesture({
      onRight: appActionCreators.showTree,
      onLeft: appActionCreators.hideTree,
      onTap: appActionCreators.hidePopups,
      gestureZoneSelector: modRichText.richText,
      minimumLength: 170,
    });
  }, []);
  return (
    <>
      <div
        id={'rich-text'}
        ref={richTextRef}
        className={modRichText.richText}
        {...(html
          ? {
              contentEditable: contentEditable,
              dangerouslySetInnerHTML: { __html: html },
            }
          : {
              children: error ? (
                <span className={modRichText.richText__error}>
                  could not fetch the node
                </span>
              ) : (
                <SpinnerCircle />
              ),
            })}
      />
    </>
  );
};

export { RichText };
