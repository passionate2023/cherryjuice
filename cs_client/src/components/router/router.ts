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
    signIn: () => history.push(`/login`),
    hash: (fullLink: string) => {
      history.push(fullLink);
    },
    oauthSignup() {
      history.push(`/signup-oauth`);
    },
  },
};

export { router };
