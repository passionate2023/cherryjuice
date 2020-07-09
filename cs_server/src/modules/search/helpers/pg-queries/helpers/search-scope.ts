import { SearchScope } from '../../../it/node-search.it';

type Props = {
  searchScope: SearchScope;
  variables: string[];
  nodeId: string;
  documentId: string;
};
const searchScopeWC = ({
  searchScope,
  nodeId,
  documentId,
  variables,
}: Props): string => {
  let res = '';
  switch (searchScope) {
    case 'current-node':
      variables.push(nodeId);
      res = 'n."id" = $' + variables.length;
      break;
    case 'child-nodes':
      variables.push(nodeId);
      res = 'n."fatherId" = $' + variables.length;
      break;
    case 'current-document':
      variables.push(documentId);
      res = 'n."documentId" = $' + variables.length;
      break;
  }
  return res;
};

export { searchScopeWC };
