import { aHtmlToHtml } from './helpers/rendering/query/ahtml-to-html';
import { NodeSqliteRepository } from './repositories/node.sqlite.repository';
import { Injectable } from '@nestjs/common';
import { Node } from './entities/node.entity';

@Injectable()
export class NodeService {
  constructor(private nodeContentRepository: NodeSqliteRepository) {}
  async getHtml(node_id: string): Promise<string> {
    const ahtml = await this.nodeContentRepository.getAHtml(node_id);

    return aHtmlToHtml({
      richText: ahtml,
    });
  }

  async getNodesMeta(): Promise<Node[]> {
    return this.nodeContentRepository.getNodesMeta();
  }
  async getNodeMetaById(node_id: number): Promise<Node[]> {
    return this.nodeContentRepository.getNodeMetaById(node_id);
  }

  // async setNodeHtml({ file_id, node_id, abstract_html }) {
  //   const { xmlString, otherTables } = aHtmlToCtb(JSON.parse(abstract_html));
  //   await this.nodeContentRepository.write({
  //     table: 'node',
  //     tuples: [['txt', xmlString]],
  //     node_id,
  //     file_id,
  //   });
  //   await Object.entries(otherTables).map(([tableName, rows]) =>
  //     Promise.all(
  //       (rows as any[]).map(row =>
  //         this.nodeContentRepository.write({
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
