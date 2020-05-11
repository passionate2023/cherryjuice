import { modRichText } from '::sass-modules/index';
import * as React from 'react';
import { useRouteMatch } from 'react-router';
import { SpinnerCircle } from '::shared-components/spinner-circle';
import { NodeMeta } from '::types/graphql/adapters';
import { useGetNodeHtml } from '::app/editor/document/rich-text/hooks/get-node-html';
import { useSetCurrentNode } from '::app/editor/document/rich-text/hooks/set-current-node';
import { ContentEditable } from '::app/editor/document/rich-text/content-editable';

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
  const match = useRouteMatch();
  // @ts-ignore
  const node_id = Number(match.params?.node_id);

  const {
    html,
    error: htmlError,
    processLinks: processLinksDueToHtmlChange,
  } = useGetNodeHtml({
    node_id,
    reloadRequestIDs,
    file_id,
    nodeId: nodes?.get(node_id)?.id,
  });

  useSetCurrentNode(node_id, nodes);

  return (
    <div className={modRichText.richText__container}>
      {html?.htmlRaw ? (
        <ContentEditable
          contentEditable={contentEditable}
          html={html}
          nodeId={nodes.get(node_id)?.id}
          file_id={file_id}
          node_id={node_id}
          processLinks={[processLinksDueToHtmlChange, processLinks]}
        />
      ) : htmlError ? (
        <span className={modRichText.richText__error}>
          could not fetch the node
        </span>
      ) : (
        <SpinnerCircle />
      )}
    </div>
  );
};

export { RichText };
