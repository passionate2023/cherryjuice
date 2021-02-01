import { Icons } from './icons';
import { IconName } from '::root/components/icon/icon';
type IconGroup = 'cherrytree' | 'material' | 'misc';
const getIconGroup = (name: IconName): IconGroup =>
  Icons.material[name] ? 'material' : Icons.misc[name] ? 'misc' : 'cherrytree';

export { getIconGroup };
