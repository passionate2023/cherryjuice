import { AuthUser } from '::types/graphql/generated';
const authState = {
  token: '',
  storage: sessionStorage.getItem('cs.user.token')
    ? 'sessionStorage'
    : 'localStorage',
};
const getSavedSession = (): AuthUser => {
  const token = window[authState.storage].getItem('cs.user.token') || '';
  const user = window[authState.storage].getItem('cs.user.user');
  const session = { token, user: user ? JSON.parse(user) : {} };
  if (!token || !user) {
    delete session.user;
    delete session.token;
  }
  return session;
};
const saveSession = ({ token, user }: AuthUser) => {
  authState.token = token;
  window[authState.storage].setItem('cs.user.token', token);
  window[authState.storage].setItem('cs.user.user', JSON.stringify(user));
};
const getToken = () => (authState.token ? `Bearer ${authState.token}` : '');

const setStorage = (local = true) => {
  authState.storage = local ? 'localStorage' : 'sessionStorage';
};
export { getSavedSession, saveSession, getToken, setStorage };
