import { createBrowserHistory } from 'history';
import { extractDocumentFromPathname } from '::root/components/app/components/editor/hooks/document-routing/helpers/extract-document-from-pathname';

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
    node: (documentId: string, node_id: number) => {
      const c = extractDocumentFromPathname();
      const existingPath = `/document/${c.documentId}/node/${c.node_id}`;
      const newPath = `/document/${documentId}/node/${node_id}`;
      if (existingPath !== newPath) {
        history.push(newPath);
      }
    },
    home: () => {
      history.push(`/`);
    },
    signIn: () => history.push(`/auth/login`),
    hash: (fullLink: string) => {
      history.push(fullLink);
    },
    oauthSignup() {
      history.push(`/auth/signup-oauth`);
    },
    resetPassword(token: string) {
      history.push(`/auth/reset-password#${token}`);
    },
  },
};

export { router };
