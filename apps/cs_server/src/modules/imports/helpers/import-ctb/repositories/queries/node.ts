const nodeQueries = {
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
    n.node_id, n.name, n.is_richtxt, n.has_image, n.has_codebox,
    n.has_table,n.ts_creation as createdAt,n.ts_lastsave as updatedAt, 
    c.father_id,c.sequence, n.is_ro as read_only, b.node_id as bookmark, b.sequence as bookmark_sequence
   FROM node as n INNER JOIN children AS c
   on n.node_id = c.node_id
   LEFT JOIN bookmark as b
   on n.node_id = b.node_id
   ${node_id ? `where n.node_id = ${node_id}` : ''}`,
  },
  write: {
    column: ({ table, column, value, node_id }) => ` 
    UPDATE ${table} 
    SET ${column} = '${value}' 
    WHERE node_id = ${node_id}`,
  },
};
type SqliteNodeMeta = {
  name: string;
  node_id: number;
  is_ro: number;
  is_richtxt: number;
  has_image: number;
  has_codebox: number;
  has_table: number;
  ts_creation: number;
  createdAt: number;
  updatedAt: number;
  father_id: number;
  sequence: number;
  read_only: number;
  bookmark: number;
  bookmark_sequence: number;
};

export { nodeQueries };
export { SqliteNodeMeta };
