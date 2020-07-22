import { Store } from '::root/store/store';

const isDocumentOwner = (state: Store): boolean =>
  state.auth.user &&
  (state.document.owner
    ? state.auth.user?.id === state.document.owner.userId
    : true);

export { isDocumentOwner };
