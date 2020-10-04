import { DocumentSqliteRepository } from './document.sqlite.repository';
import { Image as RawImage } from '../entities/Image';
import { Grid } from '../entities/Grid';
import { Codebox } from '../entities/Codebox';
import { getPNGSize } from '../rendering/image/get-image-size';
import { parseXml } from '@cherryjuice/ctb-to-ahtml';
import { ctbToAHtml } from '@cherryjuice/ctb-to-ahtml';
import { AHtmlLine } from '@cherryjuice/ahtml-to-html';
import { nodeQueries, SqliteNodeMeta } from './queries/node';
import { generateRootNode } from '../rendering/node-meta/generate-root-node';

export class NodeSqliteRepository {
  constructor(private documentSqliteRepository: DocumentSqliteRepository) {}

  private async getNodeText(node_id: string): Promise<{ txt: string }> {
    return this.documentSqliteRepository.sqliteGet(
      nodeQueries.read.text({ node_id }),
    );
  }

  private async getNodeImagesTablesCodeboxes({
    node_id,
  }): Promise<{ image: RawImage[]; codebox: Codebox[]; table: Grid[] }> {
    return {
      image: await this.documentSqliteRepository.sqliteAll(
        nodeQueries.read.images({ node_id, offset: undefined }),
      ),
      codebox: await this.documentSqliteRepository.sqliteAll(
        nodeQueries.read.codebox({ node_id }),
      ),
      table: await this.documentSqliteRepository.sqliteAll(
        nodeQueries.read.table({ node_id }),
      ),
    };
  }

  async getNodesMeta(node_id?: number): Promise<SqliteNodeMeta[]> {
    const data: SqliteNodeMeta[] = await this.documentSqliteRepository.sqliteAll(
      nodeQueries.read.node_meta(node_id),
    );

    data.push(generateRootNode());
    return data;
  }

  async getAHtml(node_id: string, imagesIds?: string[]): Promise<AHtmlLine[]> {
    const { txt } =
      node_id === '0'
        ? { txt: '<?xml version="1.0" ?><node><rich_text></rich_text></node>' }
        : await this.getNodeText(node_id);
    const { codebox, table, image } = await this.getNodeImagesTablesCodeboxes({
      node_id,
    });
    const otherTables = {
      codebox,
      image: image.map(
        ({ node_id, offset, justification, anchor, png, link }, i) => ({
          node_id,
          offset,
          justification,
          anchor,
          link,
          id: imagesIds[i] || `${node_id}/${i}`,
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
    return ctbToAHtml({
      nodeTableXml: txt,
      otherTables,
    });
  }
}
