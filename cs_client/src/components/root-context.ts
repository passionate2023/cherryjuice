import { createContext } from 'react';

const RootContext = createContext({
  session: undefined,
  setSession: undefined,
});

export { RootContext };
