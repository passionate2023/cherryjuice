import { modRichText } from '::sass-modules';
import { default as React, useContext, useRef } from 'react';
import { useSetupStuff } from '::root/components/app/components/editor/document/components/rich-text/hooks/setup-stuff';
import { useScrollToHashElement } from '::hooks/use-scroll-to-hash-element';
import { useReactRouterForAnchors } from '::root/components/app/components/editor/document/components/rich-text/hooks/react-router-for-anchors';
import { useAttachImagesToHtml } from '::root/components/app/components/editor/document/components/rich-text/hooks/get-node-images';
import { useHandleContentChanges } from '::root/components/app/components/editor/document/components/rich-text/hooks/handle-content-changes';
import { useAddMetaToPastedImages } from '::root/components/app/components/editor/document/components/rich-text/hooks/add-meta-to-pasted-images';
import { DocumentContext } from '::root/components/app/components/editor/document/reducer/context';

type Props = {
  contentEditable;
  html: string;
  nodeId;
  file_id;
  node_id;
  processLinks;
  isDocumentOwner: boolean;
};

const ContentEditable = ({
  contentEditable,
  html,
  nodeId,
  file_id,
  node_id,
  processLinks,
  isDocumentOwner,
}: Props) => {
  const { pastedImages } = useContext(DocumentContext);
  useSetupStuff(node_id);

  const ref = useRef();
  useHandleContentChanges({ nodeId, ref });
  useAddMetaToPastedImages({ requestId: pastedImages });
  useAttachImagesToHtml({
    node_id,
    file_id,
    nodeId,
    html,
  });
  useScrollToHashElement({ html: html });

  useReactRouterForAnchors({
    file_id,
    processLinks: processLinks,
    node_id,
  });
  return (
    <div
      ref={ref}
      key={node_id}
      className={modRichText.richText}
      contentEditable={contentEditable && isDocumentOwner}
      dangerouslySetInnerHTML={{ __html: html }}
      data-id={nodeId}
      data-node_id={node_id}
      id={'rich-text'}
    />
  );
};

export { ContentEditable };
