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
import { TCtNode } from '../../client/types/types';
import { parseRichText } from '../helpers/cherrytree/interpreter/interpreter';
import { splitter } from '../helpers/cherrytree/interpreter/splitter';
import { separator } from '../helpers/cherrytree/interpreter/separator';

const query = `
  SELECT 
    n.node_id,   c.father_id, n.name, n.txt, 
    n.is_richtxt, n.has_image, n.has_codebox,
    n.has_table,n.ts_creation,n.ts_lastsave
   FROM node as n INNER JOIN children AS c
   on n.node_id = c.node_id
   `;

const rootNode = {
  node_id: 0,
  father_id: -1,
  name: 'root',
  txt: '',
  is_richtxt: 0,
  has_image: 0,
  has_codebox: 0,
  has_table: 0,
  ts_creation: 0,
  ts_lastsave: 0,
  child_nodes: []
};

const getData = async () => {
  const dbPath = path.resolve(__dirname, '../../ctb/file.ctb');
  const db = await sqlite.open(dbPath);

  const data: TCtNode[] = await db
    .all(query)
    .then(data => data.map(node => ({ ...node, child_nodes: [] })));

  rootNode.child_nodes = [];
  data.push(rootNode);

  return data;
};

const organizeData = async data => {
  const nodes: Map<number, TCtNode> = new Map(
    data.map(node => [node.node_id, node])
  );

  data.forEach(node => {
    let parentNode = nodes.get(node.father_id);
    if (parentNode) parentNode.child_nodes.push(node.node_id);
  });

  return { nodes };
};

const loadNodes = async (): Promise<TCtNode[]> => {
  let rawData = await getData();
  rawData.forEach(async node => {
    console.log('parsing node', node.name);
    node.txt_parsed = await parseRichText({
      xml: node.txt
    }).then(parsed => {
      console.log(parsed);
      return JSON.stringify(splitter(separator(parsed)));
    });
  });
  const { nodes } = await organizeData(rawData);
  return Array.from(nodes.values());
};

export { loadNodes };
