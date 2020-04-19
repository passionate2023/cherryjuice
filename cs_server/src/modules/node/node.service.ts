import { aHtmlToHtml } from './helpers/rendering/query/ahtml-to-html';
import { NodeSqliteRepository } from './repositories/node.sqlite.repository';
import { Injectable } from '@nestjs/common';
import { Node } from './entities/node.entity';
import { Document } from '../document/entities/document.entity';
import { copyProperties } from '../document/helpers';
import { INodeService } from './interfaces/node.service';
import { NodeRepository } from './repositories/node.repository';

@Injectable()
export class NodeService implements INodeService {
  constructor(
    private nodeRepository: NodeRepository,
    private nodeSqliteRepository: NodeSqliteRepository,
  ) {}
  async getAHtml(node_id: string): Promise<{ nodes: any; styles: any }[]> {
    return await this.nodeSqliteRepository.getAHtml(node_id);
  }

  async getHtml(node_id: string): Promise<string> {
    const ahtml = await this.nodeSqliteRepository.getAHtml(node_id);

    return aHtmlToHtml({
      richText: ahtml,
    });
  }

  async getNodesMeta(): Promise<Node[]> {
    return this.nodeSqliteRepository.getNodesMeta();
  }

  async getNodeMetaById(node_id: number): Promise<Node[]> {
    return this.nodeSqliteRepository.getNodeMetaById(node_id);
  }

  async saveNodes(newDocument: Document): Promise<{ nodesWithImages: Node[] }> {
    const nodes = await this.getNodesMeta();
    const nodesWithImages = [];
    for (const nodeToBeSaved of nodes) {
      nodeToBeSaved.ahtml = JSON.stringify(
        await this.getAHtml(String(nodeToBeSaved.node_id)),
      );
      const node = new Node();
      copyProperties(nodeToBeSaved, node, {});
      node.document = newDocument;
      await node.save();
      if (node.has_image) nodesWithImages.push(node);
    }
    return { nodesWithImages };
  }
  // async setNodeHtml({ file_id, node_id, abstract_html }) {
  //   const { xmlString, otherTables } = aHtmlToCtb(JSON.parse(abstract_html));
  //   await this.nodeSqliteRepository.write({
  //     table: 'node',
  //     tuples: [['txt', xmlString]],
  //     node_id,
  //     file_id,
  //   });
  //   await Object.entries(otherTables).map(([tableName, rows]) =>
  //     Promise.all(
  //       (rows as any[]).map(row =>
  //         this.nodeSqliteRepository.write({
  //           table: tableName,
  //           tuples: Object.entries(row),
  //           node_id,
  //           file_id,
  //         }),
  //       ),
  //     ),
  //   );
  // }
}
