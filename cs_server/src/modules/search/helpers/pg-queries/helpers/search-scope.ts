import { SearchScope } from '../../../it/node-search.it';
import { QueryCreatorState } from './time-filter';

type Props = {
  searchScope: SearchScope;
  state: QueryCreatorState;
  nodeId: string;
  documentId: string;
};
const searchScopeWC = ({
  searchScope,
  nodeId,
  documentId,
  state,
}: Props): string => {
  let res = '';
  switch (searchScope) {
    case 'current-node':
      state.variables.push(nodeId);
      res = 'n."id" = $' + state.variables.length;
      break;
    case 'child-nodes':
      state.variables.push(nodeId);
      res = 'n."fatherId" = $' + state.variables.length;
      break;
    case 'current-document':
      state.variables.push(documentId);
      res = 'n."documentId" = $' + state.variables.length;
      break;
  }
  return res;
};

export { searchScopeWC };
