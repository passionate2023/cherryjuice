import { modRichText } from '::sass-modules/index';
import { default as React, useContext, useRef } from 'react';
import { useSetupStuff } from '::app/editor/document/rich-text/hooks/setup-stuff';
import { useScrollToHashElement } from '::hooks/use-scroll-to-hash-element';
import { useReactRouterForAnchors } from '::app/editor/document/rich-text/hooks/react-router-for-anchors';
import { useAttachImagesToHtml } from '::app/editor/document/rich-text/hooks/get-node-images';
import { useHandleContentChanges } from '::app/editor/document/rich-text/hooks/handle-content-changes';
import { useAddMetaToPastedImages } from '::app/editor/document/rich-text/hooks/add-meta-to-pasted-images';
import { DocumentContext } from '::app/editor/document/reducer/context';
const ContentEditable = ({
  contentEditable,
  html,
  nodeId,
  file_id,
  node_id,
  processLinks,
}: {
  contentEditable;
  html: { htmlRaw: string; node_id: number };
  nodeId;
  file_id;
  node_id;
  processLinks;
}) => {
  const { pastedImages } = useContext(DocumentContext);
  useSetupStuff();
  useScrollToHashElement({ html: html.htmlRaw });

  useAttachImagesToHtml({
    node_id,
    file_id,
    nodeId,
  });
  useReactRouterForAnchors({
    file_id,
    processLinks: processLinks,
  });
  const ref = useRef();
  useHandleContentChanges({ nodeId, ref });
  useAddMetaToPastedImages({ requestId: pastedImages });
  return (
    <div
      ref={ref}
      key={node_id}
      className={modRichText.richText}
      contentEditable={contentEditable}
      dangerouslySetInnerHTML={{ __html: html.htmlRaw }}
      data-id={nodeId}
      data-node_id={node_id}
      id={'rich-text'}
    />
  );
};

export { ContentEditable };
