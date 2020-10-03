import { createContext } from 'react';
import {
  documentInitialState,
  TDocumentState,
} from '::root/components/app/components/editor/document/reducer/initial-state';

const context = createContext<TDocumentState>(documentInitialState);

export { context as DocumentContext };
