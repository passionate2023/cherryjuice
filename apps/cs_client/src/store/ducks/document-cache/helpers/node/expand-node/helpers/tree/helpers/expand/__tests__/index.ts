import {
  expandNode,
  NodeState,
} from '::store/ducks/document-cache/helpers/node/expand-node/helpers/tree/helpers/expand/expand-node';
import { nodes } from '::store/ducks/document-cache/helpers/node/expand-node/helpers/tree/__tests__/data/doc1';

const tree: NodeState = {
  0: {},
};

describe('expand node', () => {
  it('should expand node 6', () => {
    expandNode({ nodes, tree, node_id: 6 });
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
  });

  it('should expand node 8', () => {
    expandNode({ nodes, tree, node_id: 8 });
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

  it('should expand node 13', () => {
    expandNode({ nodes, tree, node_id: 13 });
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
});
