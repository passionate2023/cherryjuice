import { createTransform } from 'redux-persist';

const documentId = createTransform(
  null,
  documentId => {
    return /^\/document\/.*\//.test(location.pathname) ? undefined : documentId;
  },
  {
    whitelist: ['documentId'],
  },
);

const documentTransforms = [documentId];

export { documentTransforms };
