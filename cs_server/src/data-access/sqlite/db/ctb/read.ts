import { rootNode } from '../../../../helpers/ctb';
import { db } from '../index';
import { Ct_Node_Meta } from '../../../../types/generated';

const readQueries = {
  node_meta: ({ node_id }) => `
  SELECT 
    n.node_id, n.name, n.is_ro, 
    n.is_richtxt, n.has_image, n.has_codebox,
    n.has_table,n.ts_creation,n.ts_lastsave, c.father_id,c.sequence 
   FROM node as n INNER JOIN children AS c
   on n.node_id = c.node_id ${node_id ? `AND n.node_id = ${node_id}` : ''}
   `,
  node_text: ({ node_id }) => `
  SELECT 
    n.node_id, n.name, n.txt 
   FROM node as n
   where n.node_id = ${node_id}
   `,
  images: ({ node_id, offset }) => `
    SELECT 
    i.node_id,  i.offset, i.justification, 
    i.anchor, i.png
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
};

const getNodesMeta = async ({
  filePath,
  node_id,
}: {
  filePath: string;
  node_id: number;
}) => {
  const data: Ct_Node_Meta[] = await db.open(filePath).then(db =>
    db.all(readQueries.node_meta({ node_id })).then(data =>
      data.map(node => ({
        ...node,
        child_nodes: [],
        // has_txt: node.txt.length > rootNode.txt.length,
        // todo: find a way to check wether a node is mpty without quering its text
        is_empty: false,
      })),
    ),
  );

  if (!node_id) {
    rootNode.child_nodes = [];
    data.push(rootNode);
  }

  return data;
};

const getNodeText = async ({ filePath, node_id }) => {
  return await db
    .open(filePath)
    .then(db => db.all(readQueries.node_text({ node_id })));
};
const getNodeImagesTablesCodeboxes = async ({ node_id, filePath }) => {
  return {
    image: await db
      .open(filePath)
      .then(db => db.all(readQueries.images({ node_id, offset: undefined }))),
    codebox: await db
      .open(filePath)
      .then(db => db.all(readQueries.codebox({ node_id }))),
    table: await db
      .open(filePath)
      .then(db => db.all(readQueries.table({ node_id }))),
  };
};

const getNodeImages = async ({ filePath, node_id, offset }) => {
  return db
    .open(filePath)
    .then(db => db.all(readQueries.images({ node_id: node_id, offset })));
};

const readOperations = {
  getNodeImages,
  getNodeText,
  getNodeImagesTablesCodeboxes,
  getNodesMeta,
};

export { readOperations };
