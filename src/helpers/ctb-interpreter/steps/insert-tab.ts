import { compose } from 'ramda';
const countCharacter = str => Array.from(str.matchAll(/\t/g)).length;
const generateTabNodes = length => ({ type: 'tab', length });
// Array.from({ length }).map(() => ({
//   type: 'tab'
// }));
const cutString = (full, remainingHalves) =>
  // console.log({ full, remainingHalves }),
  full.substr(0, full.length - remainingHalves.join().length);
const tabs = compose(
  // val => (console.log('after gen', val), val),
  generateTabNodes,
  // val => (console.log('after count', val), val),
  countCharacter,
  // val => (console.log('after cut', JSON.stringify(val)), val),
  cutString
);

type t = (string | { _?: string; $?: any })[];
const insertTab = ({ parsedXml }: { parsedXml: t }) => {
  const res = [];
  parsedXml.forEach(node => {
    if (typeof node === 'object' && /\t/.test(node._)) {
      while (/\t/g.test(node._)) {
        const [firstHalf, ...remainingHalves] = node._.split(/\t+/);
        const toBeInserted = [];
        if (firstHalf) toBeInserted.push({ ...node, _: firstHalf });
        toBeInserted.push(tabs(node._, remainingHalves));
        if (remainingHalves[0])
          toBeInserted.push({ ...node, _: remainingHalves[0] });
        res.push(...toBeInserted);
        node._ = node._.replace(/\t+/, '');
        node._ = node._.replace(firstHalf, '');
        node._ = node._.replace(remainingHalves[0], '');
      }
    } else if (typeof node === 'string' && /\t/g.test(node)) {
      while (/\t/g.test(node)) {
        const [firstHalf, ...secondHalf] = node.split(/\t+/);
        const toBeInserted = [];
        if (firstHalf) toBeInserted.push(firstHalf);
        toBeInserted.push(tabs(node, secondHalf));
        if (secondHalf[0]) toBeInserted.push(secondHalf[0]);
        node = node.replace(/\t+/, '');
        node = node.replace(firstHalf, '');
        node = node.replace(secondHalf[0], '');
        res.push(...toBeInserted);
      }
    } else res.push(node);
  });
  return res;
};
export { insertTab };
