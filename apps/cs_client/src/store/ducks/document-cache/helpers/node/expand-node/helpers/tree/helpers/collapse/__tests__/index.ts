import { nodes } from '::store/ducks/document-cache/helpers/node/expand-node/helpers/tree/__tests__/data/doc1';
import { NodeState } from '::store/ducks/document-cache/helpers/node/expand-node/helpers/tree/helpers/expand/expand-node';
import {
  collapseNode,
  flattenTree,
  unFlattenTree,
} from '::store/ducks/document-cache/helpers/node/expand-node/helpers/tree/helpers/collapse/collapse-node';

const tree: NodeState = {
  0: {
    1: {
      3: {
        5: {
          6: {},
        },
      },
    },
    2: {
      7: {
        8: {},
        10: {
          11: {
            12: {
              13: {},
            },
          },
        },
      },
    },
  },
};

describe('tree state', () => {
  it('should flatten full tree', () => {
    const flatTree = flattenTree(tree);
    expect(flatTree).toEqual([0, 1, 3, 5, 6, 2, 7, 8, 10, 11, 12, 13]);
  });

  it('should un-flatten full tree', () => {
    const restoredTree = unFlattenTree(
      [1, 3, 5, 6, 2, 7, 8, 10, 11, 12, 13],
      nodes,
    );
    expect(restoredTree).toEqual(tree);
  });

  it('should collapse node 10', () => {
    collapseNode(nodes, tree, 10);
    expect(tree).toEqual({
      0: {
        1: {
          3: {
            5: {
              6: {},
            },
          },
        },
        2: {
          7: {
            8: {},
          },
        },
      },
    });
  });
  it('should collapse node 1', () => {
    collapseNode(nodes, tree, 1);
    expect(tree).toEqual({
      0: {
        2: {
          7: {
            8: {},
          },
        },
      },
    });
  });
  it('should flatten collapsed tree', () => {
    const flatTree = flattenTree(tree);
    expect(flatTree).toEqual([0, 2, 7, 8]);
  });

  it('should un-flatten collapsed tree', () => {
    const restoredTree = unFlattenTree([2, 7, 8], nodes);
    expect(restoredTree).toEqual(tree);
  });
});
