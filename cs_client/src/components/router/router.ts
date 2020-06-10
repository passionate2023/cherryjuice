import { createBrowserHistory } from 'history';

const history = createBrowserHistory();
const router = {
  __history: history,
  get location() {
    return history.location;
  },
  document: (documentId: string) => {
    history.push(`/document/${documentId}/`);
  },
  node: (documentId: string, node_id: number) => {
    history.push(`/document/${documentId}/node/${node_id}`);
  },
  home: () => {
    history.push(`/`);
  },
  login: () => history.push(`/login`),
  hash: (fullLink: string) => {
    history.push(fullLink);
  },
};

export { router };
