import path from 'path';

const translateLink = ({ node }) => {
  const newNode: { $: { [key: string]: string }; _: string } = { $: {}, _: '' };
  newNode.$ = {};
  newNode._ = node._;
  if (node.other_attributes.type === 'node') {
    const [, id, value] = node.other_attributes.href.match(/node-(\d+)#(.+)$/);
    newNode.$.link = `node ${id} ${value}`;
  } else if (node.other_attributes.type === 'web') {
    newNode.$.link = `webs ${node.other_attributes.href}`;
  } else if (node.other_attributes.type === 'folder') {
    const [, value] = node.other_attributes.href.match(/file:\/\/\/(.+$)/);
    const encryptedValue = new Buffer(path.resolve(value)).toString('base64');
    newNode.$.link = `fold ${encryptedValue}`;
  } else if (node.other_attributes.type === 'file') {
    const [, value] = node.other_attributes.href.match(/file:\/\/\/(.+$)/);
    const encryptedValue = new Buffer(path.resolve(value)).toString('base64');
    newNode.$.link = `file ${encryptedValue}`;
  }
  return newNode;
};

export { translateLink };
