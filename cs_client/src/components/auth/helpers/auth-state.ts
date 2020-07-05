import { AuthUser } from '::types/graphql/generated';
const localSessionManager = (() => {
  const authState = {
    token: '',
    storage: sessionStorage.getItem('cs.user.token')
      ? 'sessionStorage'
      : 'localStorage',
  };
  const get = (): AuthUser => {
    const token = window[authState.storage].getItem('cs.user.token') || '';
    const user = window[authState.storage].getItem('cs.user.user');
    const session = { token, user: user ? JSON.parse(user) : {} };
    if (!token || !user) {
      delete session.user;
      delete session.token;
    }
    return session;
  };
  const set = ({ token, user }: AuthUser) => {
    window[authState.storage].setItem('cs.user.token', token);
    window[authState.storage].setItem('cs.user.user', JSON.stringify(user));
  };
  const clear = () => {
    localStorage.removeItem('cs.user.token');
    localStorage.removeItem('cs.user.user');
  };

  const setStorageType = (local = true) => {
    authState.storage = local ? 'localStorage' : 'sessionStorage';
  };

  return { setStorageType, clear, set, get };
})();

export { localSessionManager };
