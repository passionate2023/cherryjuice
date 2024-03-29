import { getParentsNode_ids } from '::store/ducks/document-cache/helpers/node/expand-node/helpers/tree/helpers/get-parents-node-ids/get-parents-node-ids';
import { nodes } from '::store/ducks/document-cache/helpers/node/expand-node/helpers/tree/__tests__/data/doc1';

describe('getParentsNode_ids', () => {
  it('should return list of father_ids of node 6', () => {
    expect(getParentsNode_ids({ nodes, node_id: 6 }).reverse()).toEqual([
      1,
      3,
      5,
    ]);
  });

  it('should return list of father_ids 8', () => {
    expect(getParentsNode_ids({ nodes, node_id: 8 }).reverse()).toEqual([2, 7]);
  });

  it('should return list of father_ids of node 13', () => {
    expect(getParentsNode_ids({ nodes, node_id: 13 }).reverse()).toEqual([
      2,
      7,
      10,
      11,
      12,
    ]);
  });
});
