import { documentActionCreators } from './ducks/document';
import { dialogsActionCreators } from '::root/store/ducks/dialogs';
import { nodeActionCreators } from '::root/store/ducks/node';
import { documentOperationsActionCreators } from '::root/store/ducks/document-operations';
import { editorActionCreators } from './ducks/editor';
import { documentsListActionCreators } from './ducks/documents-list';
import { rootActionCreators } from '::root/store/ducks/root';
import { searchActionCreators } from '::root/store/ducks/search';
import { authActionCreators } from '::root/store/ducks/auth';
import { cacheActionCreators } from '::root/store/ducks/cache';

type t1 = typeof documentActionCreators &
  typeof dialogsActionCreators &
  typeof authActionCreators &
  typeof editorActionCreators &
  typeof documentsListActionCreators &
  typeof searchActionCreators &
  typeof documentOperationsActionCreators &
  typeof cacheActionCreators &
  typeof rootActionCreators &
  typeof nodeActionCreators;
export type Actions = {
  [Name in keyof t1]: t1[Name] extends (...args: any[]) => any
    ? ReturnType<t1[Name]>
    : never;
}[keyof t1];
