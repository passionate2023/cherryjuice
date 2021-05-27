import { createActionCreator as _ } from 'deox';
export const create_ = (prefix: string) => {
  return {
    noPayload: (label: string) => _(`${prefix}::${label}`),
    withPayload: <T = undefined>(label: string) =>
      _(`${prefix}::${label}`, _ => (payload: T) => _(payload)),
  };
};
/*
 usage
 const ___ = create___('home');

const ac = {
  selectFolder: ___<string>('select-folder'),
}
 */
