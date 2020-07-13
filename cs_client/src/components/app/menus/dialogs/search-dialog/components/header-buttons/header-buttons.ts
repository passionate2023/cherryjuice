import { ac } from '::root/store/store';
import { DialogHeaderButton } from '::shared-components/dialog/dialog-header';
import { Icons } from '::shared-components/icon/icon';

const dialogHeaderButtons: DialogHeaderButton[] = [
  { icon: Icons.material.pin, onClick: ac.root.toggleDockedDialog },
];

export { dialogHeaderButtons };
