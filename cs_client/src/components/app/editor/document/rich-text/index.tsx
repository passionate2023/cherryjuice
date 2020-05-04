import * as React from 'react';
import { useEffect, useRef } from 'react';
import { useRouteMatch } from 'react-router';
import { SpinnerCircle } from '::shared-components/spinner-circle';
import { setupClipboard } from '::helpers/editing/clipboard';
import { setupKeyboardEvents } from '::helpers/editing/typing';
import {
  hotKeysManager,
  setupDevHotKeys,
  setupFormattingHotKeys,
} from '::helpers/hotkeys';

import { modRichText } from '::sass-modules/index';
import { useReactRouterForAnchors } from '::app/editor/document/rich-text/hooks/react-router-for-anchors';
import { useScrollToHashElement } from '::hooks/use-scroll-to-hash-element';
import { appActionCreators } from '::app/reducer';
import { NodeMeta } from '::types/generated';
import { setupGesturesHandler } from '::shared-components/drawer/drawer-navigation/helpers';
import { useGetNodeContent } from '::app/editor/document/rich-text/hooks/get-node-content';
import { useSetCurrentNode } from '::app/editor/document/rich-text/hooks/set-current-node';

type Props = {
  file_id: string;
  reloadDocument: number;
  contentEditable: boolean;
  nodes: Map<number, NodeMeta>;
  processLinks: number;
};

const RichText: React.FC<Props> = ({
  file_id,
  reloadDocument,
  contentEditable,
  nodes,
  processLinks,
}) => {
  const richTextRef = useRef<HTMLDivElement>();
  const match = useRouteMatch();
  // @ts-ignore
  const node_id = Number(match.params?.node_id);

  useEffect(() => {
    setupClipboard();
    setupKeyboardEvents();
    setupFormattingHotKeys();
    setupDevHotKeys();
    hotKeysManager.startListening();
  }, []);

  const nodeContent = useGetNodeContent(
    node_id,
    reloadDocument,
    file_id,
    processLinks,
    richTextRef,
  );
  const { html } = nodeContent;
  processLinks = nodeContent.processLinks;
  useReactRouterForAnchors({ file_id, processLinks });
  useScrollToHashElement({ html });
  useSetCurrentNode(node_id, nodes);

  useEffect(() => {
    setupGesturesHandler({
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
              children: nodeContent.error ? (
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
