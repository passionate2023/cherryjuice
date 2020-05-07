import { createContext } from 'react';
import { documentInitialState,TDocumentState } from '::app/editor/document/reducer/initial-state';

const context = createContext<TDocumentState>(documentInitialState);

export { context as DocumentContext };
