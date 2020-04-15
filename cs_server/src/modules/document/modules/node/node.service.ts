import { parseXml } from './helpers/xml';
import { getPNGSize } from './helpers/ctb';
import { aHtmlToHtml } from './helpers/rendering/query/ahtml-to-html';
import { ctbToAHtml } from './helpers/rendering/query/ctb-to-ahtml';
import { NodeRepository } from './node.repository';
import { Injectable } from '@nestjs/common';
import { Node } from './entities/node.entity';

@Injectable()
export class NodeService {
  constructor(private nodeContentRepository: NodeRepository) {}
  async getHtml(node_id: string): Promise<string> {
    const { txt } = await this.nodeContentRepository.getNodeText(node_id);
    const {
      codebox,
      table,
      image,
    } = await this.nodeContentRepository.getNodeImagesTablesCodeboxes({
      node_id,
    });
    const otherTables = {
      codebox,
      image: image.map(
        ({ node_id, offset, justification, anchor, png, link }) => ({
          node_id,
          offset,
          justification,
          anchor,
          link,
          ...getPNGSize(png),
        }),
      ),
      table: await Promise.all(
        table.map(async table => ({
          ...table,
          txt: await parseXml({ xml: table.txt }),
        })),
      ),
    };
    return aHtmlToHtml({
      richText: await ctbToAHtml({
        nodeTableXml: txt,
        otherTables,
      }),
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
