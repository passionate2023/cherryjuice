import { Store } from '::root/store/store';
import { AccessLevel } from '::types/graphql/generated';
const isDocumentOwner = (state: Store): boolean =>
  state.auth.user &&
  (state.document.userId ? state.auth.user.id === state.document.userId : true);
const hasWriteAccessToDocument = (state: Store): boolean =>
  state.auth.user &&
  (state.document.userId
    ? state.auth.user.id === state.document.userId ||
      state.document.guests.some(
        guest =>
          guest.userId === state.auth.user.id &&
          guest.accessLevel === AccessLevel.WRITER,
      )
    : true);

export { hasWriteAccessToDocument, isDocumentOwner };
