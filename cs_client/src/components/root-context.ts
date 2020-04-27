import { createContext } from 'react';
import { AuthUser } from '::types/graphql/generated';

const RootContext = createContext<{ session: AuthUser }>({
  session: undefined,
});

export { RootContext };
