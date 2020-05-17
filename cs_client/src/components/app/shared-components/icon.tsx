import * as React from 'react';
import { EventHandler } from 'react';
enum ICON_GROUP {
  cherrytree = 'cherrytree',
  material = 'material',
}

enum ICON_COLOR {
  black = 'black',
}
enum ICON_SIZE {
  _18 = 18,
  _24 = 24,
  _36 = 24,
  _48 = 48,
  _145 = 145,
}
const Icons = {
  material: {
    add: 'add',
    close: 'close',
    menu: 'menu',
    remove: 'remove',
    'alert-information': 'alert-information',
    'alert-error': 'alert-error',
    refresh: 'refresh',
    folder: 'folder',
    save: 'save',
    settings: 'settings',
    format: 'format',
    edit: 'edit',
    history: 'history',
    info: 'info',
    background: 'background',
    bold: 'bold',
    'clear-format': 'clear-format',
    foreground: 'foreground',
    'lock-open': 'lock-open',
    'lock-closed': 'lock-closed',
    h1: 'h1',
    h2: 'h2',
    h3: 'h3',
    h4: 'h4',
    h5: 'h5',
    h6: 'h6',
    italic: 'italic',
    'justify-center': 'justify-center',
    'justify-left': 'justify-left',
    'justify-right': 'justify-right',
    'justify-fill': 'justify-fill',
    mono: 'mono',
    small: 'small',
    strikethrough: 'strikethrough',
    sub: 'sub',
    sup: 'sup',
    underline: 'underline',
    storage: 'storage',
    'google-drive': 'google-drive',
    delete: 'delete',
    'delete-sweep': 'delete-sweep',
    clear: 'clear',
    cancel: 'cancel',
    document: 'document',
    stop: 'stop',
    person: 'person',
    'person-circle': 'person-circle',
    lock: 'lock',
    username: 'username',
    email: 'email',
  },
  misc: {
    'google-g': 'google-g',
  },
  cherrytree: {
    cherries: {
      0: 'cherry_red',
      1: 'cherry_blue',
      2: 'cherry_orange',
      3: 'cherry_cyan',
      4: 'cherry_orange_dark',
      5: 'cherry_sherbert',
      6: 'cherry_yellow',
      7: 'cherry_green',
      8: 'cherry_purple',
      9: 'cherry_black',
      10: 'cherry_grey',
      11: 'cherry_grey',
    },
    custom_icons: {
      1: 'circle-green',
      2: 'circle-yellow',
      3: 'circle-red',
      4: 'circle-grey',
      5: 'add',
      6: 'remove',
      7: 'done',
      8: 'cancel',
      9: 'edit-delete',
      10: 'warning',
      11: 'star',
      12: 'information',
      13: 'help-contents',
      14: 'home',
      15: 'index',
      16: 'mail',
      17: 'html',
      18: 'notes',
      19: 'timestamp',
      20: 'calendar',
      21: 'terminal',
      22: 'terminal-red',
      23: 'python',
      24: 'java',
      25: 'node_bullet',
      26: 'node_no_icon',
      27: 'cherry_black',
      28: 'cherry_blue',
      29: 'cherry_cyan',
      30: 'cherry_green',
      31: 'cherry_grey',
      32: 'cherry_orange',
      33: 'cherry_orange_dark',
      34: 'cherry_purple',
      35: 'cherry_red',
      36: 'cherry_sherbert',
      37: 'cherry_yellow',
      38: 'code',
      39: 'find',
      40: 'locked',
      41: 'unlocked',
      42: 'people',
      43: 'urgent',
      44: 'folder',
      45: 'leaf',
      46: 'xml',
      47: 'c',
      48: 'cpp',
    },
    additionalIcons: {
      cherries: 'cherries',
      'tree-subnode-add': 'tree-subnode-add',
      'tree-node-add': 'tree-node-add',
    },
  },
};

const getIconGroup = name =>
  Icons.material[name] ? 'material' : Icons.misc[name] ? 'misc' : 'cherrytree';

const getIconPath = ({
  name,
  size,
  color,
  group,
}: {
  name: string;
  size?: ICON_SIZE;
  color?: ICON_COLOR;
  group?: ICON_GROUP;
}) => {
  const folder = group || getIconGroup(name);
  if (!size && folder === 'material') size = 18;
  return `/icons/${folder}/${size ? `${size}/` : ''}${name}${
    color ? '-' + color : ''
  }.svg`;
};

const Icon = ({
  name,
  size,
  className,
  onClick,
  style,
  color,
  group,
}: {
  color?: ICON_COLOR;
  name: string;
  size?: ICON_SIZE;
  className?: string;
  onClick?: EventHandler<any>;
  style?: React.CSSProperties;
  group?: ICON_GROUP;
}) => (
  <img
    src={getIconPath({ name, size, color, group })}
    alt={name}
    {...(className && { className })}
    {...(onClick && { onClick })}
    {...(style && { style })}
  />
);

export { Icon, Icons };
export { ICON_COLOR, ICON_GROUP, ICON_SIZE };