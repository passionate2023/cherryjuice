import * as React from 'react';
import { modSearchResult } from '::sass-modules/';
import { NodeSearchResultEntity } from '::types/graphql/generated';
import { Link } from 'react-router-dom';

type Props = {
  result: NodeSearchResultEntity;
};

const Result: React.FC<Props> = ({ result }) => {
  return (
    <div className={modSearchResult.searchResult}>
      <span
        className={modSearchResult.searchResult__headline}
        dangerouslySetInnerHTML={{ __html: result.headline }}
      />
      <Link
        className={modSearchResult.searchResult__location}
        to={`/document/${result.documentId}/node/${result.node_id}`}
      >
        {result.documentName}/{result.nodeName}
      </Link>
    </div>
  );
};

export { Result };
