import { DocumentRepository } from '../../document.repository';
import { Injectable } from '@nestjs/common';
import { Image } from '../../helpers/copy-ctb/entities/Image';
import { Grid } from '../../helpers/copy-ctb/entities/Grid';
import { Codebox } from '../../helpers/copy-ctb/entities/Codebox';
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
  },
  write: {
    column: ({ table, column, value, node_id }) => ` 
    UPDATE ${table} 
    SET ${column} = '${value}' 
    WHERE node_id = ${node_id}`,
  },
};

@Injectable()
export class NodeContentRepository {
  constructor(private documentRepository: DocumentRepository) {}
  async getNodeText(node_id: string): Promise<{ txt: string }> {
    return this.documentRepository.get(queries.read.text({ node_id }));
  }

  async getNodeImages({ node_id, offset }): Promise<Image[]> {
    return this.documentRepository.all(
      queries.read.images({ node_id: node_id, offset }),
    );
  }

  async getNodeImagesTablesCodeboxes({
    node_id,
  }): Promise<{ image: Image[]; codebox: Codebox[]; table: Grid[] }> {
    return {
      image: await this.documentRepository.all(
        queries.read.images({ node_id, offset: undefined }),
      ),
      codebox: await this.documentRepository.all(
        queries.read.codebox({ node_id }),
      ),
      table: await this.documentRepository.all(queries.read.table({ node_id })),
    };
  }

  // async write({ table, tuples, node_id, file_id }): Promise<void> {
  // return db
  //   .open(file_id)
  //   .then(db =>
  //     Promise.all(
  //       tuples.map(([column, value]) =>
  //         db.run(queries.write.column({ table, column, node_id, value })),
  //       ),
  //     ),
  //   );
  // }
}
