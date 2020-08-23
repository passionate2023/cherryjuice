import { ac } from '::store/store';
import { DialogHeaderButton } from '::root/components/shared-components/dialog/dialog-header';
import { Icons } from '::root/components/shared-components/icon/icon';
import { modButton } from '::sass-modules';

const dialogHeaderButtons = ({ docked }): DialogHeaderButton[] => [
  {
    icon: Icons.material.pin,
    onClick: ac.root.toggleDockedDialog,
    text: docked ? 'unpin' : 'pin',
    className: modButton.buttonRotated45,
  },
];

export { dialogHeaderButtons };
