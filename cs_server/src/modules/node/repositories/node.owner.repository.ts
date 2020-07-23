import { EntityRepository, Repository } from 'typeorm';
import { CreateDocumentOwnershipDTO } from '../../document/repositories/document.owner.repository';
import { NodeOwner } from '../entities/node.owner.entity';
import { Node } from '../entities/node.entity';
import { OwnershipLevel } from '../../document/entities/document.owner.entity';
import { UnauthorizedException } from '@nestjs/common';
import { MutateNodeMetaDTO } from '../dto/mutate-node.dto';

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

  async updateOwnership({
    getNodeDTO: { documentId, userId, node_id },
    data,
  }: MutateNodeMetaDTO): Promise<void> {
    const ownership = await this.findOneOrFail({
      userId,
      documentId,
      node_id,
    });
    if (ownership.ownershipLevel !== OwnershipLevel.OWNER)
      throw new UnauthorizedException();

    ownership.public = data.owner.public;
    await this.save(ownership);
  }
}
