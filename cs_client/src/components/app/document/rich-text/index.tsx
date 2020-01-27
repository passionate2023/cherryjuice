import rtModule from '::sass-modules/rich-text.scss';
import * as React from 'react';
import { Fragment } from 'react';
import { Link as CtLink } from './link';
import { useQuery } from '@apollo/react-hooks';
import { QUERY_CT_NODE_CONTENT } from '::graphql/queries';
import { Png } from './png';
import { SpinnerCircle } from '::shared-components/spinner-circle';
import { Code } from './code';
import { Table } from './table';
import { Tab } from '::shared-components/tab';
import anchorIcon from '::assets/icons/anchor.svg';
import { useRouteMatch } from 'react-router';
type Props = {
  has_txt: boolean;
  file_id: string;
};
const RichText: React.FC<Props> = ({ has_txt, file_id }) => {
  const match = useRouteMatch();
  // @ts-ignore
  const node_id = Number(match.params?.node_id);
  const { loading, error, data } = useQuery(QUERY_CT_NODE_CONTENT.rich_txt, {
    variables: { file_id, node_id: node_id }
  });
  let richText: any[];

  if (data && data.ct_node_content[0].node_id === node_id) {
    richText = JSON.parse(data.ct_node_content[0].rich_txt);
  }
  return (
    <article className={rtModule.richText} >
      {!richText && <SpinnerCircle />}
      {error && <p>error</p>}
      {richText &&
        richText.map((inlineNodes, i) => (
          <>
            {inlineNodes.map((node, i) => (
              <Fragment key={i}>
                {typeof node === 'object' ? (
                  // !node._ && node.$ && pngMeta && pngMeta[pngCounter] ? (
                  node.type ? (
                    node.type === 'tab' ? (
                      // pngMeta[pngCounter].anchor ? (
                      <Tab length={node.length} />
                    ) : node.type === 'anchor' ? (
                      // pngMeta[pngCounter].anchor ? (
                      <img
                        id={node.other_attributes.id}
                        className={rtModule.richText__anchor}
                        src={anchorIcon}
                        alt="icon"
                      />
                    ) : node.type === 'png' ? (
                      <Png
                        key={i}
                        node_id={node_id}
                        offset={node.other_attributes.offset}
                        height={node.$.height}
                        width={node.$.width}
                        // thumbnail={pngMeta[pngCounter++].thumbnail}
                        file_id={file_id}
                      />
                    ) : node.type === 'code' ? (
                      <Code
                        styles={node.$}
                        other_attributes={node.other_attributes}
                        text={node._}
                      />
                    ) : node.type === 'table' ? (
                      <Table
                        styles={node.$}
                        other_attributes={node.other_attributes}
                        table={node.table}
                      />
                    ) : (
                      <></>
                    )
                  ) : (
                    <>
                      {node.tags.reduce(
                        // @ts-ignore
                        (acc, val) => {
                          if (typeof val !== 'string') console.log('val', val);
                          return typeof val === 'string' ? (
                            React.createElement(`${val}`, {style:{ ...node.$, display: 'inline' }}, acc)
                          ) : (
                            <CtLink
                              target={val[1].target}
                              href={val[1].href}
                              text={node._}
                            />
                          );
                        },
                        <>{node._}</>
                      )}
                    </>
                  )
                ) : (
                  <>{node}</>
                )}
              </Fragment>
            ))}
            <br />
          </>
        ))}
    </article>
  );
};

export { RichText };
