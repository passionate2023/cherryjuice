import { documentActionCreators } from './ducks/document';
import { dialogsActionCreators } from './ducks/dialogs';
import { nodeActionCreators } from './ducks/node';
import { documentOperationsActionCreators } from './ducks/document-operation/document-operations';
import { editorActionCreators } from './ducks/editor';
import { documentsListActionCreators } from './ducks/documents-list';
import { rootActionCreators } from './ducks/root';
import { searchActionCreators } from './ducks/search';
import { authActionCreators } from './ducks/auth';
import { cacheActionCreators } from './ducks/cache/cache';
import { timelinesActionCreators } from '::store/ducks/timelines';

type t1 = typeof documentActionCreators &
  typeof dialogsActionCreators &
  typeof authActionCreators &
  typeof editorActionCreators &
  typeof documentsListActionCreators &
  typeof searchActionCreators &
  typeof documentOperationsActionCreators &
  typeof cacheActionCreators &
  typeof timelinesActionCreators &
  typeof rootActionCreators &
  typeof nodeActionCreators;
export type Actions = {
  [Name in keyof t1]: t1[Name] extends (...args: any[]) => any
    ? ReturnType<t1[Name]>
    : never;
}[keyof t1];
