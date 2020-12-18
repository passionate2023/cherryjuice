import { Icons } from './icons';
type IconGroup = 'cherrytree' | 'material' | 'misc';
const getIconGroup = (name: string): IconGroup =>
  Icons.material[name] ? 'material' : Icons.misc[name] ? 'misc' : 'cherrytree';

export { getIconGroup };
