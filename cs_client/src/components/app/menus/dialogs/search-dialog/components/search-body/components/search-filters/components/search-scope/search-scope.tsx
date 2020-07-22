import * as React from 'react';
import { joinClassNames } from '::helpers/dom/join-class-names';
import { modSearchFilter } from '::sass-modules/';
import {
  Scope,
  ScopeProps,
} from '::app/menus/dialogs/search-dialog/components/search-body/components/search-filters/components/search-scope/components/scope';
import { Store } from '::root/store/store';
import { connect, ConnectedProps } from 'react-redux';
import { SearchScope as TSearchScope } from '::types/graphql/generated';
import { isDocumentOwner } from '::root/store/selectors/document/is-document-owner';

const mapState = (state: Store) => ({
  selectedScope: state.search.searchScope,
  selectedNode: state.document.selectedNode,
  documentId: state.document.documentId,
  isDocumentOwner: isDocumentOwner(state),
});
const mapDispatch = {};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = {};

const SearchScope: React.FC<Props & PropsFromRedux> = ({
  selectedScope,
  selectedNode,
  documentId,
  isDocumentOwner,
}) => {
  const noSelectedDocument = !documentId;
  const noSelectedNode = noSelectedDocument || !selectedNode.node_id;

  const scopes: Omit<ScopeProps, 'selectedScope'>[] = [
    { scope: TSearchScope.allDocuments, disabled: !isDocumentOwner },
    {
      scope: TSearchScope.currentDocument,
      disabled: noSelectedDocument,
    },
    { scope: TSearchScope.childNodes, disabled: noSelectedNode },
    {
      scope: TSearchScope.currentNode,
      disabled: noSelectedNode,
    },
  ];

  return (
    <div className={joinClassNames([modSearchFilter.searchFilter])}>
      <span className={modSearchFilter.searchFilter__label}>search scope</span>
      <div className={modSearchFilter.searchFilter__list}>
        {scopes.map(args => (
          <Scope key={args.scope} {...args} selectedScope={selectedScope} />
        ))}
      </div>
    </div>
  );
};
const _ = connector(SearchScope);
export { _ as SearchScope };
