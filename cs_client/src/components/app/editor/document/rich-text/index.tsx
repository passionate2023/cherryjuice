import { modRichText } from '::sass-modules/index';
import * as React from 'react';
import { useRef } from 'react';
import { useRouteMatch } from 'react-router';
import { SpinnerCircle } from '::shared-components/spinner-circle';
import { useReactRouterForAnchors } from '::app/editor/document/rich-text/hooks/react-router-for-anchors';
import { useScrollToHashElement } from '::hooks/use-scroll-to-hash-element';
import { NodeMeta } from '::types/generated';
import { useGetNodeHtml } from '::app/editor/document/rich-text/hooks/get-node-html';
import { useSetCurrentNode } from '::app/editor/document/rich-text/hooks/set-current-node';
import { useSetupStuff } from '::app/editor/document/rich-text/hooks/setup-stuff';
import { useGetNodeImages } from '::app/editor/document/rich-text/hooks/get-node-images';

type Props = {
  file_id: string;
  reloadRequestIDs: string[];
  contentEditable: boolean;
  nodes: Map<number, NodeMeta>;
  processLinks: number;
};

const RichText: React.FC<Props> = ({
  file_id,
  reloadRequestIDs,
  contentEditable,
  nodes,
  processLinks,
}) => {
  const richTextRef = useRef<HTMLDivElement>();
  const match = useRouteMatch();
  // @ts-ignore
  const node_id = Number(match.params?.node_id);

  const {
    html: htmlWithoutImages,
    error: htmlError,
    processLinks: processLinksDueToHtmlChange,
  } = useGetNodeHtml({
    node_id,
    reloadRequestIDs,
    file_id,
  });
  const {
    processLinks: processLinksDueToImagesChange,
    html,
  } = useGetNodeImages({
    html: htmlWithoutImages,
    file_id,
    node_id,
    richTextRef,
  });
  useReactRouterForAnchors({
    file_id,
    processLinks:
      processLinksDueToHtmlChange ||
      processLinksDueToImagesChange ||
      processLinks,
  });
  useScrollToHashElement({ html });
  useSetCurrentNode(node_id, nodes);
  useSetupStuff();
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
              children: htmlError ? (
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
