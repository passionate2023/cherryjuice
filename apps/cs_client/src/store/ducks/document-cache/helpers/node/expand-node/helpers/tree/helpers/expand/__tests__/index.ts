import { expandNode } from '::store/ducks/document-cache/helpers/node/expand-node/helpers/tree/helpers/expand/expand-node';
import { nodes } from '::store/ducks/document-cache/helpers/node/expand-node/helpers/tree/__tests__/data/doc1';
import { tree } from '::cypress/support/test-utils/interact/components/tree';

describe('expandNode', () => {
  it('should expand node', () => {
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
