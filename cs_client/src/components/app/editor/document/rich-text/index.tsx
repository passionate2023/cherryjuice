import { modRichText } from '::sass-modules/index';
import * as React from 'react';
import { useHistory, useRouteMatch } from 'react-router';
import { SpinnerCircle } from '::shared-components/spinner-circle';
import { NodeMeta } from '::types/graphql/adapters';
import { useGetNodeHtml } from '::app/editor/document/rich-text/hooks/get-node-html';
import { useSetCurrentNode } from '::app/editor/document/rich-text/hooks/set-current-node';
import { ContentEditable } from '::app/editor/document/rich-text/content-editable';
import { useEffect } from 'react';
import { apolloCache } from '::graphql/cache/apollo-cache';

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
  const history = useHistory();
  // @ts-ignore
  const node_id = Number(match.params?.node_id);
  const nodeId = nodes?.get(node_id)?.id;
  const {
    html,
    error: htmlError,
    processLinks: processLinksDueToHtmlChange,
  } = useGetNodeHtml({
    node_id,
    reloadRequestIDs,
    file_id,
    nodeId,
  });

  useSetCurrentNode(node_id, nodes);

  useEffect(() => {
    const nodeIsNew = apolloCache.changes.isNodeNew(nodeId);
    if (htmlError && !nodeIsNew) {
      history.push('/document/' + file_id);
    }
  }, [htmlError]);

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
      ) : (
        !htmlError && <SpinnerCircle />
      )}
    </div>
  );
};

export { RichText };
