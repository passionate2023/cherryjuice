import { Image } from '@cherryjuice/graphql-types';
type ErrorHandler = (error: Error) => void;
type SelectNode = (props: {
  documentId: string;
  node_id: number;
  hash: string;
}) => void;
type SetScrollPosition = (props: {
  documentId: string;
  node_id: number;
  position: [number, number];
}) => void;
type SaveHtml = (props: {
  documentId: string;
  node_id: number;
  html: string;
  deletedImages?: string[];
  newImages?: Image[];
}) => void;
type GetNodeImageIDsFromCache = (props: {
  documentId: string;
  node_id: number;
}) => string[];

type EditObject = (target: HTMLElement) => void;
export type Bridge = {
  current: {
    onPastedImages: () => void;
    onPasteImageErrorHandler: ErrorHandler;
    onPasteErrorHandler: ErrorHandler;
    onFormattingErrorHandler: ErrorHandler;
    selectNode: SelectNode;
    onTypingError: ErrorHandler;
    setScrollPosition: SetScrollPosition;
    saveHtml: SaveHtml;
    getNodeImageIDsFromCache: GetNodeImageIDsFromCache;
    editAnchor: (id: string) => void;
    getDocumentId: () => string;
    editLink: EditObject;
    editTable: EditObject;
    editCodebox: EditObject;
    flagEditedNode: (props: { node_id: number; documentId: string }) => void;
  };
};
const noop = () => undefined;
export const bridge: Bridge = {
  current: {
    onPasteImageErrorHandler: noop,
    onPasteErrorHandler: noop,
    onFormattingErrorHandler: noop,
    selectNode: noop,
    onTypingError: noop,
    setScrollPosition: noop,
    saveHtml: noop,
    getNodeImageIDsFromCache: noop,
    editAnchor: noop,
    editLink: noop,
    editTable: noop,
    editCodebox: noop,
    flagEditedNode: noop,
    getDocumentId: noop,
    onPastedImages: noop,
  },
};
