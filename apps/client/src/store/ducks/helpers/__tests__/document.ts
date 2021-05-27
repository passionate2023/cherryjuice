import { getFlatListOfChildrenTree } from '../document';
import { NodesDict } from '::store/ducks/document-cache/document-cache';

const tree = {
  '0': {
    node_id: 0,
    child_nodes: [1, 4],
    father_id: -1,
  },
  '1': {
    node_id: 1,
    father_id: 0,
    child_nodes: [2],
  },
  '2': {
    node_id: 2,
    father_id: 1,
    child_nodes: [3],
  },
  '3': {
    node_id: 3,
    father_id: 2,
    child_nodes: [],
  },
  '4': {
    child_nodes: [],
    node_id: 4,
    father_id: 0,
  },
};
describe('getFlatListOfChildrenTree', () => {
  it('should return an array of nested children recursively', () => {
    const list = getFlatListOfChildrenTree()(tree as NodesDict)(1);
    expect(list.sort()).toEqual([1, 2, 3]);
  });
});
