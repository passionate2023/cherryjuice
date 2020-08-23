import { modRichText } from '::sass-modules';
import { default as React, useContext, useRef } from 'react';
import { useSetupStuff } from '::root/components/app/components/editor/document/components/rich-text/hooks/setup-stuff';
import { useScrollToHashElement } from '::hooks/use-scroll-to-hash-element';
import { useReactRouterForAnchors } from '::root/components/app/components/editor/document/components/rich-text/hooks/react-router-for-anchors';
import { useAttachImagesToHtml } from '::root/components/app/components/editor/document/components/rich-text/hooks/get-node-images';
import { useHandleContentChanges } from '::root/components/app/components/editor/document/components/rich-text/hooks/handle-content-changes';
import { useAddMetaToPastedImages } from '::root/components/app/components/editor/document/components/rich-text/hooks/add-meta-to-pasted-images';
import { DocumentContext } from '::root/components/app/components/editor/document/reducer/context';
import { Image } from '::types/graphql/generated';

type Props = {
  contentEditable;
  html: string;
  nodeId;
  file_id;
  node_id;
  processLinks;
  isDocumentOwner: boolean;
  fetchNodeStarted: boolean;
  images: Image[];
};

const ContentEditable = ({
  contentEditable,
  html,
  nodeId,
  file_id,
  node_id,
  processLinks,
  isDocumentOwner,
  images,
  fetchNodeStarted,
}: Props) => {
  const { pastedImages } = useContext(DocumentContext);
  useSetupStuff(node_id);

  const ref = useRef();
  useHandleContentChanges({ node_id, documentId: file_id, ref });
  useAddMetaToPastedImages({ requestId: pastedImages });
  useAttachImagesToHtml({
    node_id,
    file_id,
    nodeId,
    html,
    images,
  });
  useScrollToHashElement({ fetchNodeStarted });

  useReactRouterForAnchors({
    file_id,
    processLinks: processLinks,
    node_id,
    fetchNodeStarted,
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
      data-document-id={file_id}
      id={'rich-text'}
    />
  );
};

export { ContentEditable };
