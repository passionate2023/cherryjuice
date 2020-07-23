import { EntityRepository, Repository } from 'typeorm';
import { CreateDocumentOwnershipDTO } from '../../document/repositories/document.owner.repository';
import { NodeOwner } from '../entities/node.owner.entity';
import { OwnershipLevel } from '../../document/entities/document.owner.entity';
import { UnauthorizedException } from '@nestjs/common';
import { MutateNodeMetaDTO } from '../dto/mutate-node.dto';

export type CreateNodeOwnershipDTO = CreateDocumentOwnershipDTO & {
  nodeId: string;
  node_id: number;
};

@EntityRepository(NodeOwner)
export class NodeOwnerRepository extends Repository<NodeOwner> {
  createOwnership = async ({
    userId,
    documentId,
    ownershipLevel,
    isPublic,
    nodeId,
    node_id,
  }: CreateNodeOwnershipDTO): Promise<NodeOwner> => {
    const nodeOwnerEntity = new NodeOwner(
      userId,
      documentId,
      ownershipLevel,
      isPublic,
    );
    nodeOwnerEntity.node_id = node_id;
    nodeOwnerEntity.nodeId = nodeId;
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
