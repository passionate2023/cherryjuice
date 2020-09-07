import {
  collapseNode,
  expandNode,
  getParentsNode_ids,
  TreeState,
} from '::store/ducks/cache/document-cache/helpers/node/expand-node/helpers/tree/tree';
import { nodes } from '::store/ducks/cache/document-cache/helpers/node/expand-node/helpers/tree/__tests__/data/doc1';

const tree: TreeState = {
  0: {},
};

describe('tree state', () => {
  it('should return list of father_ids', () => {
    expect(getParentsNode_ids(undefined, nodes, 6).reverse()).toEqual([
      1,
      3,
      5,
    ]);
    expect(getParentsNode_ids(undefined, nodes, 8).reverse()).toEqual([2, 7]);
    expect(getParentsNode_ids(undefined, nodes, 13).reverse()).toEqual([
      2,
      7,
      10,
      11,
      12,
    ]);
  });

  it('should expand node', () => {
    expandNode(nodes, tree, 6);
    expect(tree).toEqual({
      0: {
        1: {
          3: {
            5: {
              6: {},
            },
          },
        },
      },
    });

    expandNode(nodes, tree, 8);
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
    expandNode(nodes, tree, 13);
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
    });
  });

  it('should collapse node', () => {
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
});
