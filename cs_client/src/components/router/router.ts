import { createBrowserHistory } from 'history';
import { extractDocumentFromPathname } from '::root/components/app/components/editor/hooks/router-effect/helpers/extract-document-from-pathname';

const history = createBrowserHistory();
const router = {
  get: {
    __history: history,
    get location() {
      return history.location;
    },
  },
  goto: {
    document: (documentId: string) => {
      history.push(`/document/${documentId}/`);
    },
    node: (documentId: string, node_id: number, hash = '') => {
      const c = extractDocumentFromPathname();
      const existingPath = `/document/${c.documentId}/node/${c.node_id}${hash}`;
      const newPath = `/document/${documentId}/node/${node_id}${hash}`;
      if (existingPath !== newPath) {
        history.push(newPath);
      }
    },
    home: () => {
      history.push(`/`);
    },
    signIn: () => history.push(`/auth/login`),
    oauthSignup() {
      history.push(`/auth/signup-oauth`);
    },
    resetPassword(token: string) {
      history.push(`/auth/reset-password#${token}`);
    },
  },
};

export { router };
