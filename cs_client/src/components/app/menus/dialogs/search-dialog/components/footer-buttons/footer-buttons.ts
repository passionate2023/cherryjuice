import { TDialogFooterButton } from '::shared-components/dialog/dialog-footer';
import { ac } from '::root/store/store';

const footerLeftButtons: TDialogFooterButton[] = [
  { label: 'close', onClick: ac.search.setSearchIdle, disabled: false },
];

export { footerLeftButtons };
