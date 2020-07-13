import { ac } from '::root/store/store';
import { DialogHeaderButton } from '::shared-components/dialog/dialog-header';
import { Icons } from '::shared-components/icon/icon';

const dialogHeaderButtons = ({ docked }): DialogHeaderButton[] => [
  {
    icon: Icons.material.pin,
    onClick: ac.root.toggleDockedDialog,
    text: docked ? 'unpin' : 'pin',
  },
];

export { dialogHeaderButtons };
