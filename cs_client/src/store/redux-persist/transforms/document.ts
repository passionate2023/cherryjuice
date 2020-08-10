import { createTransform } from 'redux-persist';
import { defaultRootNode } from '../../ducks/helpers/document';

const documentIdAndSelectedNode = createTransform(
  null,
  (value, key) => {
    switch (key) {
      case 'documentId':
        return /^\/document\/.*\//.test(location.pathname) ? undefined : value;
      case 'selectedNode':
        return /^\/document\/.*\/node\/\d+/.test(location.pathname)
          ? defaultRootNode
          : value;
    }
  },
  {
    whitelist: ['documentId', 'selectedNode'],
  },
);

const documentTransforms = [documentIdAndSelectedNode];

export { documentTransforms };
