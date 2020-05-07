import { default as React, Ref } from 'react';
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
  myRef,
}: {
  contentEditable;
  html: { htmlRaw: string; htmlWithImages: string; node_id: number };
  nodeId;
  file_id;
  node_id;
  processLinks;
  myRef: Ref<HTMLDivElement>;
}) => {
  useSetupStuff();
  useScrollToHashElement({ html: html.htmlWithImages });

  const { processLinks: processLinksDueToImagesChange } = useAttachImagesToHtml(
    {
      html,
      file_id,
      richTextRef: myRef,
    },
  );
  useReactRouterForAnchors({
    file_id,
    processLinks: [...processLinks, processLinksDueToImagesChange],
  });
  return (
    <div
      ref={myRef}
      className={modRichText.richText}
      contentEditable={contentEditable}
      dangerouslySetInnerHTML={{ __html: html.htmlWithImages || html.htmlRaw }}
      data-id={nodeId}
      data-node_id={node_id}
      id={'rich-text'}
    />
  );
};

export { ContentEditable };
