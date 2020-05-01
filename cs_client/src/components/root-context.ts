import { createContext } from 'react';
import { TRootState } from '::root/root.reducer';

const RootContext = createContext<TRootState>({
  session: undefined,
  secrets: undefined,
});

export { RootContext };
