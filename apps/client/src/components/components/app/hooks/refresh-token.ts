import { useLazyQuery } from '@apollo/react-hooks';
import { useEffect } from 'react';
import { ac } from '::store/store';

export const useRefreshToken = ({ token }) => {
  const [fetch, { data, error }] = useLazyQuery(QUERY_USER.query, {
    fetchPolicy: 'no-cache',
  });
  useEffect(() => {
    if (token) fetch();
  }, []);
  useEffect(() => {
    const session = QUERY_USER.path(data);
    if (session) {
      ac.auth.setSession(session);
    } else if (error) {
      ac.auth.clearSession();
    }
  }, [data, error]);
};
