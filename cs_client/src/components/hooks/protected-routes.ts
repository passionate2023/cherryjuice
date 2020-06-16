import { useEffect } from 'react';
import { router } from '::root/router/router';
import { localSessionManager } from '::auth/helpers/auth-state';

const useProtectedRoutes = ({ session }) => {
  useEffect(() => {
    const isOnLoginOrSignUp = /(^\/login|^\/signup)/.test(
      router.location.pathname,
    );
    if (!session.token) {
      if (!isOnLoginOrSignUp) router.login();
      localSessionManager.clear();
    } else {
      if (isOnLoginOrSignUp) router.home();
      localSessionManager.set(session);
    }
  }, [session]);
};

export { useProtectedRoutes };
