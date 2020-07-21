import { EntityRepository, Repository } from 'typeorm';
import { CreateDocumentOwnershipDTO } from '../../document/repositories/document.owner.repository';
import { NodeOwner } from '../entities/node.owner.entity';
import { Node } from '../entities/node.entity';

export type CreateNodeOwnershipDTO = CreateDocumentOwnershipDTO & {
  node: Node;
};

@EntityRepository(NodeOwner)
export class NodeOwnerRepository extends Repository<NodeOwner> {
  createOwnership = async ({
    user,
    document,
    node,
    ownershipLevel,
  }: CreateNodeOwnershipDTO): Promise<NodeOwner> => {
    const nodeOwnerEntity = new NodeOwner(user, document, ownershipLevel);
    nodeOwnerEntity.node_id = node.node_id;
    nodeOwnerEntity.nodeId = node.id;
    await nodeOwnerEntity.save();
    return nodeOwnerEntity;
  };
}
