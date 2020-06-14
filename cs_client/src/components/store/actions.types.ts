import { documentActionCreators } from './ducks/document';
import { dialogsActionCreators } from '::root/store/ducks/dialogs';
import { nodeActionCreators } from '::root/store/ducks/node';
import { editorActionCreators } from './ducks/editor';

type t1 = typeof documentActionCreators &
  typeof dialogsActionCreators &
  typeof editorActionCreators &
  typeof nodeActionCreators;
export type Actions = {
  [Name in keyof t1]: t1[Name] extends (...args: any[]) => any
    ? ReturnType<t1[Name]>
    : never;
}[keyof t1];
