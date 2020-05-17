import { createContext } from 'react';
import { rootInitialState, TRootState } from '::root/root.reducer';

const RootContext = createContext<TRootState>(rootInitialState);

export { RootContext };
