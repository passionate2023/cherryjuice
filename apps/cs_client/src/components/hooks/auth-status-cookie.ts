import { useEffect } from 'react';
import { cookie } from '::helpers/dom/cookies';

type AuthStatusCookieProps = { userId: string };

const useAuthStatusCookie = ({ userId }: AuthStatusCookieProps) => {
  useEffect(() => {
    if (userId) cookie.set('auth', 'true');
    else cookie.delete('auth');
  }, [userId]);
};

export { useAuthStatusCookie };
