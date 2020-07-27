import { EntityRepository, Repository, SelectQueryBuilder } from 'typeorm';
import { Node } from '../entities/node.entity';
import { Injectable } from '@nestjs/common';
import { copyProperties } from '../../document/helpers';
import { SaveHtmlIt } from '../it/save-html.it';
import { NodeMetaIt, NodePrivacy } from '../it/node-meta.it';
import { AHtmlLine } from '../helpers/rendering/ahtml-to-html';
import { NodeSearchDto } from '../../search/dto/node-search.dto';
import { NodeSearchResultEntity } from '../../search/entities/node.search-result.entity';
import { SearchTarget, SearchType } from '../../search/it/node-search.it';
import { nodeSearch } from '../../search/helpers/pg-queries/node-search';
import { Document, Privacy } from '../../document/entities/document.entity';
import {
  CreateNodeDTO,
  DeleteNodeDTO,
  GetNodeDTO,
  GetNodesDTO,
  MutateNodeContentDTO,
  MutateNodeMetaDTO,
} from '../dto/mutate-node.dto';
import {
  and_,
  or_,
} from '../../search/helpers/pg-queries/helpers/clause-builder';
import {
  AccessLevel,
  DocumentGuest,
} from '../../document/entities/document-guest.entity';
import { GetterSettings } from '../../document/repositories/document.repository';

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
  `n.privacy`,
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

export type RunFirst = <T>(q: SelectQueryBuilder<T>) => SelectQueryBuilder<T>;

@Injectable()
@EntityRepository(Node)
export class NodeRepository extends Repository<Node> {
  async getNodes(
    dto: GetNodesDTO,
    target: NodeSelection = 'meta',
  ): Promise<Node[]> {
    return await this.baseQueryBuilder(dto, target, {
      write: false,
    }).getMany();
  }
  baseQueryBuilder = (
    { documentId, userId }: GetNodeDTO | GetNodesDTO,
    target: NodeSelection = 'meta',
    { runFirst, write }: GetterSettings,
  ) => {
    let queryBuilder = this.createQueryBuilder('n')
      .leftJoin(Document, 'd', 'n."documentId" = d.id ')
      .leftJoin(DocumentGuest, 'g', 'n."documentId" = g."documentId"')
      .select(select(target));
    if (runFirst) queryBuilder = runFirst<Node>(queryBuilder);
    return queryBuilder
      .andWhere('n."documentId" = :documentId', { documentId })
      .andWhere(
        or_()
          .or(`d."userId" = :userId`)
          .orIf(!write, `n.privacy isnull`)
          .orIf(!write, `n."privacy"  >= :publicPrivacy`)
          .or(
            and_()
              .and(`g."userId" = :userId `)
              .and(
                or_()
                  .or(`n.privacy isnull`)
                  .or(`n."privacy"  >= :guestOnlyPrivacy`),
              )
              .andIf(write, `g."accessLevel" >= :writeAccessLevel`),
          )
          .get(),
        {
          userId,
          publicPrivacy: Privacy.PUBLIC,
          guestOnlyPrivacy: Privacy.GUESTS_ONLY,
          writeAccessLevel: AccessLevel.WRITER,
        },
      );
  };
  async _getNodeById(
    dto: GetNodeDTO,
    target: NodeSelection = 'meta',
    write: boolean,
  ): Promise<Node> {
    return this.baseQueryBuilder(dto, target, {
      runFirst: queryBuilder =>
        queryBuilder.andWhere('n."node_id" = :node_id', {
          node_id: dto.node_id,
        }),
      write,
    }).getOne();
  }

  async getNodeById(
    dto: GetNodeDTO,
    target: NodeSelection = 'meta',
  ): Promise<Node> {
    return this._getNodeById(dto, target, false);
  }
  async getWNodeById(
    dto: GetNodeDTO,
    target: NodeSelection = 'meta',
  ): Promise<Node> {
    return this._getNodeById(dto, target, true);
  }
  async getAHtml(dto: GetNodeDTO): Promise<AHtmlLine[]> {
    return await this.getNodeById(dto, 'ahtml').then(node =>
      JSON.parse(node.ahtml),
    );
  }

  async createNode({ data, getNodeDTO }: CreateNodeDTO): Promise<Node> {
    const node = new Node();
    if (data.privacy === NodePrivacy.DEFAULT) delete data.privacy;
    copyProperties(data, node, {});
    node.documentId = getNodeDTO.documentId;
    node.createdAt = new Date(data.createdAt);
    node.updatedAt = new Date(data.updatedAt);
    if (node.father_id !== -1) {
      node.father = await this.getNodeById({
        ...getNodeDTO,
        node_id: node.father_id,
      });
    }
    await this.save(node);
    return node;
  }

  private async updateNode(
    attributes: SaveHtmlIt | NodeMetaIt,
    dto: GetNodeDTO,
  ): Promise<Node> {
    const node = await this.getWNodeById(dto);
    if (typeof attributes.updatedAt === 'number')
      attributes.updatedAt = (new Date(attributes.updatedAt) as unknown) as any;
    if ('node_id' in attributes) delete attributes.node_id;
    if (attributes['privacy'] === NodePrivacy.DEFAULT) {
      delete attributes['privacy'];
      node.privacy = null;
    }
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
  async deleteNode(dto: DeleteNodeDTO): Promise<string> {
    const node = await this.getWNodeById(dto.getNodeDTO);
    return await this.remove(node).then(res => JSON.stringify(res));
  }
  async getNodesMetaAndAHtml(dto: GetNodesDTO): Promise<Node[]> {
    return await this.getNodes(dto, 'meta-and-ahtml');
  }

  async findNodes({
    it,
    userId,
  }: NodeSearchDto): Promise<NodeSearchResultEntity[]> {
    const { query, variables } = nodeSearch({ it, userId });

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
