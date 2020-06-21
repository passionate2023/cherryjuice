import { DocumentSqliteRepository } from '../../document/repositories/document.sqlite.repository';
import { Injectable } from '@nestjs/common';
import { Image as RawImage } from '../../document/helpers/copy-ctb/entities/Image';
import { Grid } from '../../document/helpers/copy-ctb/entities/Grid';
import { Codebox } from '../../document/helpers/copy-ctb/entities/Codebox';
import { Node } from '../entities/node.entity';
import { organizeData } from '../../document/helpers';
import { getPNGSize } from '../helpers/ctb';
import { parseXml } from '../helpers/xml';
import { ctbToAHtml } from '../helpers/rendering/query/ctb-to-ahtml';

const queries = {
  read: {
    text: ({ node_id }) => `
  SELECT 
   n.txt 
   FROM node as n
   where n.node_id = ${node_id}
   `,
    images: ({ node_id, offset }) => `
    SELECT 
    i.node_id,  i.offset, i.justification, 
    i.anchor, i.png, i.link
   FROM  image as i
   where i.node_id = ${node_id} ${offset ? `AND i.offset = ${offset}` : ''}
  `,
    codebox: ({ node_id }) => `
  SELECT
  node_id, offset, justification, txt, syntax, width, height, is_width_pix, do_highl_bra, do_show_linenum
  from codebox where node_id = ${node_id} 
  `,
    table: ({ node_id }) => `
  SELECT node_id, offset, justification, txt, col_min, col_max
  FROM grid
  WHERE node_id = ${node_id};
  `,
    node_meta: (node_id?: number) => `
  SELECT 
    n.node_id, n.name, n.is_ro, 
    n.is_richtxt, n.has_image, n.has_codebox,
    n.has_table,n.ts_creation as createdAt,n.ts_lastsave as updatedAt, 
    c.father_id,c.sequence, n.is_ro as read_only
   FROM node as n INNER JOIN children AS c
   on n.node_id = c.node_id
   ${node_id ? `where n.node_id = ${node_id}` : ''}`,
  },
  write: {
    column: ({ table, column, value, node_id }) => ` 
    UPDATE ${table} 
    SET ${column} = '${value}' 
    WHERE node_id = ${node_id}`,
  },
};
const convertTime = data =>
  Math.round((new Date(data * 1000) as unknown) as number);
@Injectable()
export class NodeSqliteRepository {
  constructor(private documentSqliteRepository: DocumentSqliteRepository) {}

  private async getNodeText(node_id: string): Promise<{ txt: string }> {
    return this.documentSqliteRepository.sqliteGet(
      queries.read.text({ node_id }),
    );
  }

  private async getNodeImagesTablesCodeboxes({
    node_id,
  }): Promise<{ image: RawImage[]; codebox: Codebox[]; table: Grid[] }> {
    return {
      image: await this.documentSqliteRepository.sqliteAll(
        queries.read.images({ node_id, offset: undefined }),
      ),
      codebox: await this.documentSqliteRepository.sqliteAll(
        queries.read.codebox({ node_id }),
      ),
      table: await this.documentSqliteRepository.sqliteAll(
        queries.read.table({ node_id }),
      ),
    };
  }

  async getNodesMetaRaw(node_id?: number): Promise<Node[]> {
    const data: Node[] = await this.documentSqliteRepository
      .sqliteAll(queries.read.node_meta(node_id))
      .then(data =>
        data.map(node => ({
          ...node,
          child_nodes: [],
          is_empty: 0,
          createdAt: convertTime(node.createdAt),
          updatedAt: convertTime(node.updatedAt),
        })),
      );

    // @ts-ignore
    data.push({
      node_id: 0,
      father_id: -1,
      name: 'root',
      txt: '<?xml version="1.0" ?><node><rich_text></rich_text></node>',
      is_richtxt: 0,
      has_image: 0,
      has_codebox: 0,
      has_table: 0,
      sequence: 0,
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime(),
      child_nodes: [],
      is_empty: 0,
      node_title_styles: '',
      read_only: 0,
    } as unknown);

    return data;
  }

  async getAHtml(
    node_id: string,
    imagesIds?: string[],
  ): Promise<{ nodes: any; style: any }[]> {
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

  async getNodesMeta(process = true): Promise<Node[]> {
    const nodes = await this.getNodesMetaRaw();
    if (process) {
      const nodesMap = await organizeData(nodes);
      return Array.from(nodesMap.values());
    } else return await this.getNodesMetaRaw();
  }

  async getNodeMetaById(node_id: number): Promise<Node> {
    const nodes = await this.getNodesMetaRaw();
    const nodesMap = await organizeData(nodes);
    return nodesMap.get(node_id);
  }

  // async getNodeImages({
  //   node_id,
  //   offset,
  // }): Promise<
  //   Pick<
  //     CTBImage,
  //     'node_id' | 'offset' | 'justification' | 'anchor' | 'png' | 'link'
  //   >[]
  // > {
  //   return this.documentSqliteRepository.sqliteAll(
  //     queries.read.images({ node_id: node_id, offset }),
  //   );
  // }
}
