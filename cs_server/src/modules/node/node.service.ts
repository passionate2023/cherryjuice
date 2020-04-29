import { aHtmlToHtml } from './helpers/rendering/query/ahtml-to-html';
import { NodeSqliteRepository } from './repositories/node.sqlite.repository';
import { Injectable } from '@nestjs/common';
import { Node } from './entities/node.entity';
import { NodeRepository } from './repositories/node.repository';
import { debug } from '../shared';


@Injectable()
export class NodeService {
  constructor(
    private nodeRepository: NodeRepository,
    private nodeSqliteRepository: NodeSqliteRepository,
  ) {}

  async getHtml(node_id: string, documentId: string): Promise<string> {
    if (debug.loadSqliteDocuments) {
      const ahtml = await this.nodeSqliteRepository.getAHtml(node_id);
      return aHtmlToHtml({
        richText: ahtml,
      });
    }
    const ahtml = await this.nodeRepository.getAHtml(node_id, documentId);
    return aHtmlToHtml({
      richText: ahtml,
    });
  }

  async getNodesMeta(documentId: string, ): Promise<Node[]> {
    if (debug.loadSqliteDocuments)
      return this.nodeSqliteRepository.getNodesMeta();
    return this.nodeRepository.getNodesMeta(documentId);
  }

  async getNodeMetaById(node_id: string, documentId: string): Promise<Node[]> {
    if (debug.loadSqliteDocuments)
      return this.nodeSqliteRepository.getNodeMetaById(node_id);
    return this.nodeRepository.getNodeMetaById(node_id, documentId);
  }
}
