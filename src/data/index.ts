/*
import path from 'path';
import { verbose } from 'sqlite3';
const sqlite3 = verbose();

const dbPath = path.resolve(__dirname, '../ctb/file.ctb');

let db = new sqlite3.Database(dbPath, err => {
  if (err) {
    console.error(err.message);
  }
});

db.serialize(() => {
  console.log('before querying');
  db.each(`SELECT name FROM node`, (err, row) => {
    if (err) {
      console.error(err.message);
    }
    console.log('finished');
    console.log({ row });
  });
  console.log('after querying');
});

db.close(err => {
  if (err) {
    console.error(err.message);
  }
  console.log('Close the database connection.');
});
*/

/*const organizeData1 = async data => {
  data.push(rootNode);
  const nodes = new Map(data.map(node => [node.node_id, node]));

  const tree = new Map();
  const cache = {};
  data.forEach(node => {
    if (!cache[node.father_id]) {
      cache[node.father_id] = true;
      tree.set(nodes.get(node.father_id), []);
    }
    if (node.node_id !== 0) tree.get(nodes.get(node.father_id)).push(node);
  });
  return { nodes, tree };
};*/

import * as path from 'path';
import * as sqlite from 'sqlite';
import { TCt_node, TCt_nodeImages } from '../types/types';
import { parseRichText } from '../helpers/cherrytree/interpreter/';

// selects:
//    some node properties from the node table
//    the parent_id property of the node from children table
//    images and image offset of the node from image table
const query = {
  nodes: node_id => `
  SELECT 
    n.node_id,   c.father_id, n.name, n.txt, 
    n.is_richtxt, n.has_image, n.has_codebox,
    n.has_table,n.ts_creation,n.ts_lastsave 
   FROM node as n INNER JOIN children AS c
   on n.node_id = c.node_id ${node_id ? `AND n.node_id = ${node_id}` : ''}
   
   `,
  images: node_id => `
    SELECT 
    n.node_id, i.png, i.offset
   FROM node as n INNER JOIN image as i
   on n.node_id = i.node_id  ${node_id ? `AND n.node_id = ${node_id}` : ''}
  `
};
const rootNode = {
  node_id: 0,
  father_id: -1,
  name: 'root',
  txt: '<?xml version="1.0" ?><node><rich_text></rich_text></node>',
  is_richtxt: 0,
  has_image: 0,
  has_codebox: 0,
  has_table: 0,
  ts_creation: 0,
  ts_lastsave: 0,
  child_nodes: []
};
const getData = async node_id => {
  const dbPath = path.resolve(__dirname, '../../ctb/file.ctb');
  const db = await sqlite.open(dbPath);

  const data: TCt_node[] = await db.all(query.nodes(node_id)).then(data =>
    data.map(node => ({
      ...node,
      child_nodes: []
    }))
  );

  rootNode.child_nodes = [];
  data.push(rootNode);

  return data;
};

const organizeData = async data => {
  const nodes: Map<number, TCt_node> = new Map(
    data.map(node => [node.node_id, node])
  );

  data.forEach(node => {
    let parentNode = nodes.get(node.father_id);
    if (parentNode) parentNode.child_nodes.push(node.node_id);
  });

  return { nodes };
};
// const interpretRichText = data => {
//   data.forEach(async node => {
//     console.log('parsing node', node.name);
//     node.txt_parsed = await parseRichText({
//       xml: node.txt,
//       stringify: true
//     });
//   });
// };
const loadNodes = async (rootValue, { node_id }): Promise<TCt_node[]> => {
  let rawData = await getData(node_id);
  // console.log('rawData', rawData);
  // interpretRichText(rawData);
  const { nodes: organizedNodes } = await organizeData(rawData);
  return Array.from(organizedNodes.values());
};
// rootValue is the node
// const loadImages = async rootValue => {
//   if (!rootValue.has_image) return [];
//   const dbPath = path.resolve(__dirname, '../../ctb/file.ctb');
//   const db = await sqlite.open(dbPath);
//
//   const images: TCt_nodeImages[] = await db
//     .all(query.images(rootValue.node_id))
//     .then(nodes => {
//       nodes.map(node => ({
//         ...node,
//         png: node.png.toString('base64')
//       }));
//       return nodes;
//     });
//   return images;
// };
const loadPNG = async rootValue => {
  const dbPath = path.resolve(__dirname, '../../ctb/file.ctb');
  const db = await sqlite.open(dbPath);
  return db.all(query.images(rootValue.node_id)).then(nodes =>
    nodes.map(node => ({
      ...node,
      png: new Buffer(node.png, 'binary').toString('base64')
    })))
};
const loadRichText = async rootValue => {
  console.log('txt 😳',rootValue);
  //
  // const png: TCt_nodeImages[] = await ;
  // const txt = await ;
  return parseRichText({
    xml: rootValue.txt,
    stringify: true,
    node_name: `id:${rootValue.node_id} name:${rootValue.name}`

  });
};
export { loadNodes, loadRichText, loadPNG };
