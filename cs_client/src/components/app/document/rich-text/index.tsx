import rtModule from '::sass-modules/rich-text.scss';
import * as React from 'react';
import { useRef } from 'react';
import { useRouteMatch } from 'react-router';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import { QUERY_CT_NODE_CONTENT } from '::graphql/queries';
import { usePng } from '::hooks/use-png';
import { SpinnerCircle } from '::shared-components/spinner-circle';
import { MUTATE_CT_NODE_CONTENT } from '::graphql/mutations';
import { getAHtml } from '::helpers/html-to-ctb';

type Props = {
  file_id: string;
  saveDocument: number;
  reloadDocument: number;
  dispatch: (action: { type: string; value?: any }) => void;
};

const RichText: React.FC<Props> = ({
  file_id,
  saveDocument,
  reloadDocument
}) => {
  const richTextRef = useRef<HTMLDivElement>();
  const match = useRouteMatch();
  // @ts-ignore
  const node_id = Number(match.params?.node_id);
  const [fetch, { loading, error, data }] = useLazyQuery(
    QUERY_CT_NODE_CONTENT.html,
    {
      variables: { file_id, node_id: node_id },
      fetchPolicy: 'network-only'
    }
  );
  const firstFetchRef = useRef(true);
  if (firstFetchRef.current) {
    firstFetchRef.current = false;
    fetch();
  }
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
  const toolbarQueuesRef = useRef({});
  if (saveDocument && !toolbarQueuesRef.current[saveDocument]) {
    console.log(saveDocument);
    toolbarQueuesRef.current[saveDocument] = true;
    const { abstractHtml, doc } = getAHtml();
    if (!(saveDocument + '').endsWith('_'))
      mutate({
        variables: {
          file_id: file_id || '',
          node_id,
          abstract_html: abstractHtml
        }
      });
    console.log(html);
    console.log(doc);
    console.log(JSON.parse(abstractHtml));
  }
  if (reloadDocument && !toolbarQueuesRef.current[reloadDocument]) {
    toolbarQueuesRef.current[reloadDocument] = true;
    fetch();
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
