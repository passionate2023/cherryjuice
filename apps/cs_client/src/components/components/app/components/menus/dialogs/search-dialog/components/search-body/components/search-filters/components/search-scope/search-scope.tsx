import * as React from 'react';
import { useEffect } from 'react';
import { joinClassNames } from '@cherryjuice/shared-helpers';
import { modSearchFilter } from '::sass-modules';
import {
  Scope,
  ScopeProps,
} from '::root/components/app/components/menus/dialogs/search-dialog/components/search-body/components/search-filters/components/search-scope/components/scope';
import { ac, Store } from '::store/store';
import { connect, ConnectedProps } from 'react-redux';
import {
  SearchScope as TSearchScope,
  SearchScope as ESearchScope,
} from '@cherryjuice/graphql-types';
import { hasWriteAccessToDocument } from '::store/selectors/document/has-write-access-to-document';
import { getCurrentDocument } from '::store/selectors/cache/document/document';

const mapState = (state: Store) => ({
  selectedScope: state.search.searchScope,
  selectedNode_id: getCurrentDocument(state)?.persistedState?.selectedNode_id,
  documentId: state.document.documentId,
  isDocumentOwner: hasWriteAccessToDocument(state),
});
const mapDispatch = {};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = {};

const SearchScope: React.FC<Props & PropsFromRedux> = ({
  selectedScope,
  selectedNode_id,
  documentId,
  isDocumentOwner,
}) => {
  const noSelectedDocument = !documentId;
  const noSelectedNode = noSelectedDocument || !selectedNode_id;

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
  useEffect(() => {
    if (noSelectedDocument || noSelectedNode) {
      ac.search.setSearchScope(ESearchScope.allDocuments);
    }
  }, [noSelectedNode, noSelectedDocument]);
  return (
    <div className={joinClassNames([modSearchFilter.searchFilter])}>
      <span className={modSearchFilter.searchFilter__label}>scope</span>
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
