import rtModule from '::sass-modules/rich-text.scss';
import * as React from 'react';
import { useRouteMatch } from 'react-router';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { QUERY_CT_NODE_CONTENT } from '::graphql/queries';
import { useRef } from 'react';
import { usePng } from '::hooks/use-png';
import { SpinnerCircle } from '::shared-components/spinner-circle';
import { MUTATE_CT_NODE_CONTENT } from '::graphql/mutations';
import { getPseudoHtml } from '::helpers/html-to-ctb';
import { appActions } from '::app/reducer';

type Props = {
  file_id: string;
  saveDocument: number;
  dispatch: (action: { type: string; value?: any }) => void;
};

const RichText: React.FC<Props> = ({ file_id, saveDocument, dispatch }) => {
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

  const [mutate] = useMutation(MUTATE_CT_NODE_CONTENT.html);
  const saveQueuesRef = useRef({});
  if (saveDocument && !saveQueuesRef.current[saveDocument]) {
    saveQueuesRef.current[saveDocument] = true;
    mutate({
      variables: {
        file_id: file_id || '',
        node_id,
        abstract_html: getPseudoHtml().abstractHtml
      }
    }).then(() => {
      dispatch({ type: appActions.SAVE_DOCUMENT, value: false });
    });
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

export { RichText };
