import { createContext } from 'react';
import { appInitialState, TState } from '::app/reducer';

const context = createContext<TState>(appInitialState);

export { context as AppContext };
