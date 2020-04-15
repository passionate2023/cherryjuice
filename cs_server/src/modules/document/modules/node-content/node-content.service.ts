import imageThumbnail from 'image-thumbnail';
import { parseXml } from './helpers/xml';
import { bufferToPng, getPNGSize } from './helpers/ctb';
import { aHtmlToHtml } from './helpers/rendering/query/ahtml-to-html';
import { ctbToAHtml } from './helpers/rendering/query/ctb-to-ahtml';
import { NodeContentRepository } from './node-content.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class NodeContentService {
  constructor(private nodeContentRepository: NodeContentRepository) {}
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

  async getPNGFullBase64({ node_id, offset }): Promise<string[]> {
    return this.nodeContentRepository
      .getNodeImages({
        node_id,
        offset,
      })
      .then(nodes => {
        return nodes.map(({ png }) => {
          return bufferToPng(png);
        });
      });
  }
  async getPNGThumbnailBase64({ node_id, offset }): Promise<Promise<string>[]> {
    return this.nodeContentRepository
      .getNodeImages({
        node_id,
        offset,
      })
      .then(nodes =>
        nodes.map(async ({ anchor, png }) =>
          anchor
            ? null
            : (
                await imageThumbnail(png, {
                  percentage: 5,
                  responseType: 'base64',
                })
              ).toString(),
        ),
      );
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
