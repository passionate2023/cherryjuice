import * as React from 'react';
import { joinClassNames } from '::helpers/dom/join-class-names';
import { modSearchScope } from '::sass-modules/';
import {
  Scope,
  ScopeProps,
} from '::app/menus/dialogs/search-dialog/components/search-body/components/search-scope/components/scope';
import { Store } from '::root/store/store';
import { connect, ConnectedProps } from 'react-redux';

const mapState = (state: Store) => ({
  selectedScope: state.search.searchScope,
  selectedNode: state.document.selectedNode,
  documentId: state.document.documentId,
});
const mapDispatch = {};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = {};

const SearchScope: React.FC<Props & PropsFromRedux> = ({
  selectedScope,
  selectedNode,
  documentId,
}) => {

  const noSelectedDocument = !documentId;
  const noSelectedNode = noSelectedDocument || !selectedNode.node_id;

  const scopes: ScopeProps[] = [
    { scope: 'current-node', selectedScope, disabled: noSelectedNode },
    { scope: 'child-nodes', selectedScope, disabled: noSelectedNode },
    { scope: 'current-document', selectedScope, disabled: noSelectedDocument },
    { scope: 'all-documents', selectedScope, disabled: false },
  ];

  return (
    <div className={joinClassNames([modSearchScope.searchScope])}>
      <span
        className={modSearchScope.searchScope__scopeList__scope__scopeLabel}
      >
        search scope
      </span>
      <div className={modSearchScope.searchScope__scopeList}>
        {scopes.map(args => (
          <Scope key={args.scope} {...args} />
        ))}
      </div>
    </div>
  );
};
const _ = connector(SearchScope);
export { _ as SearchScope };
