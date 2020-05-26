import { documentActionCreators } from './ducks/document';
import { dialogsActionCreators } from '::root/store/ducks/dialogs';
import { bindActionCreators } from 'redux';
import { store } from '::root/store';

type t1 = typeof documentActionCreators & typeof dialogsActionCreators;
export type Actions = {
  [Name in keyof t1]: t1[Name] extends (...args: any[]) => any
    ? ReturnType<t1[Name]>
    : never;
}[keyof t1];

export const ac = {
  document: bindActionCreators(documentActionCreators, store.dispatch),
  dialogs: bindActionCreators(dialogsActionCreators, store.dispatch),
};
