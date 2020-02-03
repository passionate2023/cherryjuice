import rtModule from '::sass-modules/rich-text.scss';
import * as React from 'react';
import { useRouteMatch } from 'react-router';
import { useQuery } from '@apollo/react-hooks';
import { QUERY_CT_NODE_CONTENT } from '::graphql/queries';
import { useEffect, useRef } from 'react';
import { usePng } from '::hooks/use-png';
import { SpinnerCircle } from '::shared-components/spinner-circle';

type Props = {
  file_id: string;
};

const RichTextSsHtml: React.FC<Props> = ({ file_id }) => {
  const richTextRef = useRef<HTMLDivElement>();
  const match = useRouteMatch();
  // @ts-ignore
  const node_id = Number(match.params?.node_id);
  const { loading, error, data } = useQuery(QUERY_CT_NODE_CONTENT.html, {
    variables: { file_id, node_id: node_id }
  });
  let html;
  if (data && data.ct_node_content[0].node_id === node_id) {
    html = data.ct_node_content[0].html;
  }

  const all_png_base64 = usePng({
    file_id,
    node_id,
    offset: undefined
  });
  if (html && all_png_base64?.node_id === node_id && richTextRef.current) {
    let counter = 0;
    while (all_png_base64.pngs.length && /<img src=""/.test(html)) {
      html = html.replace(
        /<img src=""/,
        `<img src="data:image/png;base64,${all_png_base64.pngs[counter++]}"`
      );
    }
  }
  return html ? (
    <div
      id={'rich-text'}
      ref={richTextRef}
      contentEditable={true}
      className={rtModule.richText}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  ) : (
    <div className={rtModule.richText}>
      <SpinnerCircle />
    </div>
  );
};

export { RichTextSsHtml };
