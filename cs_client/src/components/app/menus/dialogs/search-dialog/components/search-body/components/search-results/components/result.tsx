import * as React from 'react';
import { modSearchResults } from '::sass-modules/';
import { NodeSearchResultEntity } from '::types/graphql/generated';
import { Link } from 'react-router-dom';

type Props = {
  result: NodeSearchResultEntity;
};

const Result: React.FC<Props> = ({ result }) => {
  return (
    <div className={modSearchResults.searchResults__result}>
      <span
        className={modSearchResults.searchResults__result__headline}
        dangerouslySetInnerHTML={{ __html: result.headline }}
      />
      <Link
        className={modSearchResults.searchResults__result__location}
        to={`/document/${result.documentId}/node/${result.node_id}`}
      >
        {result.documentName}/{result.nodeName}
      </Link>
    </div>
  );
};

export { Result };
