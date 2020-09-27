import { AccessLevel } from '::types/graphql';
import { createSelector } from 'reselect';
import { getCurrentDocument } from '::store/selectors/cache/document/document';

const getAuthUser = state => state.auth.user;

const isDocumentOwner = createSelector(
  getAuthUser,
  getCurrentDocument,
  (user, document) => {
    return user && (document?.userId ? user.id === document.userId : true);
  },
);

const hasWriteAccessToDocument = createSelector(
  getAuthUser,
  getCurrentDocument,
  (user, document) => {
    return (
      user &&
      (document?.userId
        ? user.id === document.userId ||
          document.guests.some(
            guest =>
              guest.userId === user.id &&
              guest.accessLevel === AccessLevel.WRITER,
          )
        : true)
    );
  },
);

export { hasWriteAccessToDocument, isDocumentOwner };
