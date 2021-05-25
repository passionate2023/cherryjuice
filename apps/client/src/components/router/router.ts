import { createBrowserHistory } from 'history';
import { extractDocumentFromPathname } from '@cherryjuice/shared-helpers';

const history = createBrowserHistory();
const router = {
  get: {
    history,
  },
  goto: {
    document: (documentId: string) => {
      history.push(`/document/${documentId}/`);
    },
    node: (documentId: string, node_id: number, hash = '') => {
      const c = extractDocumentFromPathname();
      const existingPath = `/document/${c.documentId}/node/${c.node_id}${location.hash}`;
      const newPath = `/document/${documentId}/node/${node_id}${hash}`;
      if (existingPath !== newPath) {
        history.push(newPath);
      }
    },
    home: (folder?: string) => {
      history.push(`/documents${folder ? `/${folder}` : ''}`);
    },
    signIn: () => history.push(`/auth/login`),
    oauthSignup() {
      history.push(`/auth/signup-oauth`);
    },
    resetPassword() {
      history.push(`/auth/reset-password`);
    },
  },
};

export { router };
