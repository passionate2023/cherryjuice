import { _sortNodes } from '::store/ducks/document-cache/helpers/node/sort-node/helpers/sort-nods';
import { nodes } from '::store/ducks/document-cache/helpers/node/expand-node/helpers/tree/__tests__/data/doc1';

describe('sort node', function () {
  it('should sort current-level by name desc', () => {
    _sortNodes({
      nodes,
      node_id: 1,
      command: { level: 'current-level', sortDirection: 'descending' },
    });
    expect(nodes['0'].child_nodes).toEqual([2, 1]);
  });

  it('should sort children by name desc', () => {
    _sortNodes({
      nodes,
      node_id: 0,
      command: { level: 'children', sortDirection: 'descending' },
    });
    expect(nodes['0'].child_nodes).toEqual([2, 1]);
    expect(nodes['7'].child_nodes).toEqual([10, 8]);
  });
});
