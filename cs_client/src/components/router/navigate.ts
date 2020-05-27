import { createBrowserHistory } from 'history';

const history = createBrowserHistory();
const navigate = {
  __history: history,
  location: history.location,
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

export { navigate };
