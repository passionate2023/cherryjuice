import { TDialogFooterButton } from '::root/components/shared-components/dialog/dialog-footer';
import { ac } from '::store/store';

const footerLeftButtons: TDialogFooterButton[] = [
  { label: 'close', onClick: ac.search.setSearchIdle, disabled: false },
];

export { footerLeftButtons };
