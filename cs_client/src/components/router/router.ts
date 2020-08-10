import { createBrowserHistory } from 'history';

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
      history.push(`/document/${documentId}/node/${node_id}`);
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
