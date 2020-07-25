import { Store } from '::root/store/store';

const isDocumentOwner = (state: Store): boolean =>
  state.auth.user &&
  (state.document.userId ? state.auth.user.id === state.document.userId : true);

export { isDocumentOwner };
