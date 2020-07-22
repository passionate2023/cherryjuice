import { EntityRepository, Repository } from 'typeorm';
import { Node } from '../entities/node.entity';
import { Injectable } from '@nestjs/common';
import {
  CreateNodeDTO,
  GetNodeDTO,
  GetNodesDTO,
  MutateNodeContentDTO,
  MutateNodeMetaDTO,
} from '../dto/mutate-node.dto';
import { copyProperties } from '../../document/helpers';
import { SaveHtmlIt } from '../it/save-html.it';
import { NodeMetaIt } from '../it/node-meta.it';
import { AHtmlLine } from '../helpers/rendering/ahtml-to-html';
import { NodeSearchDto } from '../../search/dto/node-search.dto';
import { NodeSearchResultEntity } from '../../search/entities/node.search-result.entity';
import { SearchTarget, SearchType } from '../../search/it/node-search.it';
import { nodeSearch } from '../../search/helpers/pg-queries/node-search';
import { OwnershipLevel } from '../../document/entities/document.owner.entity';
import { NodeOwner } from '../entities/node.owner.entity';

const nodeMeta = [
  `n.id`,
  `n.name`,
  `n.node_id`,
  `n.fatherId`,
  `n.father_id`,
  `n.child_nodes`,
  `n.createdAt`,
  `n.updatedAt`,
  `n.node_title_styles`,
  `n.read_only`,
  `n.hash`,
  `n.documentId`,
  `n_o.userId`,
  `n_o.ownershipLevel`,
  `n_o.public`,
];
const nodeAhtml = ['n.ahtml'];
const fullNode = [...nodeMeta, ...nodeAhtml];
const select = (target: NodeSelection): string[] =>
  target === 'meta-and-ahtml'
    ? fullNode
    : target === 'ahtml'
    ? nodeAhtml
    : nodeMeta;
type NodeSelection = 'meta' | 'ahtml' | 'meta-and-ahtml';

@Injectable()
@EntityRepository(Node)
export class NodeRepository extends Repository<Node> {
  async getNodes(
    { documentId, ownership, userId, publicAccess }: GetNodesDTO,
    target: NodeSelection = 'meta',
  ): Promise<Node[]> {
    return await this.createQueryBuilder('n')
      .leftJoinAndMapOne('n.owner', NodeOwner, 'n_o', 'n_o."nodeId" = n.id ')
      .select(select(target))
      .andWhere(
        `( (n_o."userId" = :userId AND n_o."ownershipLevel" >= :ownership)  ${
          publicAccess ? 'OR n_o."public" = true' : ''
        })`,
        { userId, ownership },
      )
      .andWhere('n_o."documentId" = :documentId', { documentId })
      .getMany();
  }

  async getNodeById(
    { userId, ownership, documentId, node_id, publicAccess }: GetNodeDTO,
    target: NodeSelection = 'meta',
  ): Promise<Node> {
    return this.createQueryBuilder('n')
      .leftJoin(NodeOwner, 'n_o', 'n_o."nodeId" = n.id ')
      .select(select(target))
      .andWhere(
        `( (n_o."userId" = :userId AND n_o."ownershipLevel" >= :ownership)  ${
          publicAccess ? 'OR n_o."public" = true' : ''
        })`,
        { userId, ownership },
      )
      .andWhere('n_o."documentId" = :documentId', { documentId })
      .andWhere('n_o."node_id" = :node_id', { node_id })
      .getOne();
  }

  async getAHtml(dto: GetNodeDTO): Promise<AHtmlLine[]> {
    return await this.getNodeById(dto, 'ahtml').then(node =>
      JSON.parse(node.ahtml),
    );
  }

  async createNode({
    data,
    getNodeDTO: { userId, documentId },
  }: CreateNodeDTO): Promise<Node> {
    const node = new Node();
    copyProperties(data, node, {});
    node.documentId = documentId;
    node.createdAt = new Date(data.createdAt);
    node.updatedAt = new Date(data.updatedAt);
    if (node.father_id !== -1) {
      node.father = await this.getNodeById({
        node_id: node.father_id,
        documentId,
        userId,
        ownership: OwnershipLevel.WRITER,
      });
    }
    await this.save(node);
    return node;
  }

  private async updateNode(
    attributes: SaveHtmlIt | NodeMetaIt,
    dto: GetNodeDTO,
  ): Promise<Node> {
    const node = await this.getNodeById(dto);
    if (typeof attributes.updatedAt === 'number')
      attributes.updatedAt = (new Date(attributes.updatedAt) as unknown) as any;
    Object.entries(attributes).forEach(([k, v]) => {
      node[k] = v;
    });
    if (attributes['ahtml']) node.updateAhtmlTxt();
    await this.save(node);
    return node;
  }

  async setAHtml({ data, getNodeDTO }: MutateNodeContentDTO): Promise<Node> {
    return await this.updateNode(data, getNodeDTO);
  }

  async setMeta({ data, getNodeDTO }: MutateNodeMetaDTO): Promise<Node> {
    return await this.updateNode(data, getNodeDTO);
  }
  async deleteNode(dto: GetNodeDTO): Promise<string> {
    const node = await this.getNodeById(dto);
    return await this.remove(node).then(res => JSON.stringify(res));
  }
  async getNodesMetaAndAHtml(dto: GetNodesDTO): Promise<Node[]> {
    return await this.getNodes(dto, 'meta-and-ahtml');
  }

  async findNodes({
    it,
    user,
    publicAccess,
  }: NodeSearchDto): Promise<NodeSearchResultEntity[]> {
    const { query, variables } = nodeSearch({ it, user, publicAccess });

    let searchResults: NodeSearchResultEntity[] = await this.manager.query(
      query,
      variables,
    );
    if (
      it.searchOptions.caseSensitive &&
      it.searchType === SearchType.FullText
    ) {
      searchResults = searchResults.filter(res => {
        let ahtmlHeadline = true,
          nodeNameHeadline = true;
        if (it.searchTarget.includes(SearchTarget.nodeContent))
          ahtmlHeadline = res.ahtmlHeadline.includes(it.query);
        if (it.searchTarget.includes(SearchTarget.nodeTitle))
          nodeNameHeadline = res.nodeNameHeadline.includes(it.query);
        return ahtmlHeadline && nodeNameHeadline;
      });
    }
    return searchResults;
  }
}
