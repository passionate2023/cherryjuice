import { default as React } from 'react';
import { useSetupStuff } from '::app/editor/document/rich-text/hooks/setup-stuff';
import { useScrollToHashElement } from '::hooks/use-scroll-to-hash-element';
import { useReactRouterForAnchors } from '::app/editor/document/rich-text/hooks/react-router-for-anchors';
import { modRichText } from '::sass-modules/index';
import { useAttachImagesToHtml } from '::app/editor/document/rich-text/hooks/get-node-images';
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
  useSetupStuff();
  useScrollToHashElement({ html: html.htmlRaw });

  useAttachImagesToHtml({
    node_id,
    file_id,
  });
  useReactRouterForAnchors({
    file_id,
    processLinks: processLinks,
  });
  return (
    <div
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
