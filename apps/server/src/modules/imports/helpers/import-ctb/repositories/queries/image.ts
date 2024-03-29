const imageQueries = {
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
export { imageQueries };
