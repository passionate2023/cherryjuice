import { Node } from '../../../node/entities/node.entity';
import { adaptNodeStyle, adaptNodeTime } from './adapt-node-meta';
import { aHtmlToCtb } from '../../../node/helpers/rendering/mutate/ahtml-to-ctb';

const queries = {
  createTables: [
    `CREATE TABLE bookmark (
node_id INTEGER UNIQUE,
sequence INTEGER
)`,
    `
CREATE TABLE children (
node_id INTEGER UNIQUE,
father_id INTEGER,
sequence INTEGER
)`,
    `
CREATE TABLE codebox (
node_id INTEGER,
offset INTEGER,
justification TEXT,
txt TEXT,
syntax TEXT,
width INTEGER,
height INTEGER,
is_width_pix INTEGER,
do_highl_bra INTEGER,
do_show_linenum INTEGER
)`,
    `
CREATE TABLE grid (
node_id INTEGER,
offset INTEGER,
justification TEXT,
txt TEXT,
col_min INTEGER,
col_max INTEGER
)`,
    `
CREATE TABLE image (
node_id INTEGER,
offset INTEGER,
justification TEXT,
anchor TEXT,
png BLOB,
filename TEXT,
link TEXT,
time INTEGER
)`,
    `
CREATE TABLE node (
node_id INTEGER UNIQUE,
name TEXT,
txt TEXT,
syntax TEXT,
tags TEXT,
is_ro INTEGER,
is_richtxt INTEGER,
has_codebox INTEGER,
has_table INTEGER,
has_image INTEGER,
level INTEGER,
ts_creation INTEGER,
ts_lastsave INTEGER
)`,
  ].join(';'),
  insertNodeTableAndChildrenTable: ({
    node: {
      node_id,
      name,
      createdAt,
      updatedAt,
      father_id,
      node_title_styles,
      ahtml,
    },
    sequence,
  }: {
    node: Node;
    sequence: number;
  }) => {
    const { is_ro, is_richtxt } = adaptNodeStyle(node_title_styles);
    return [
      `
    INSERT INTO "main"."node" 
    ("node_id", "name", "txt", "syntax","tags", "is_ro", "is_richtxt", "has_codebox", "has_table", "has_image", "level","ts_creation","ts_lastsave") 
    VALUES 
    ('${node_id}', '${name}', '${
        ahtml
          ? aHtmlToCtb(JSON.parse(ahtml)).xmlString
          : '<?xml version="1.0" ?><node><rich_text></rich_text></node>'
      }', 'custom-colors', '', '${is_ro}', '${is_richtxt}', '0', '0', '0', '0','${adaptNodeTime(
        createdAt,
      )}','${adaptNodeTime(updatedAt)}')`,
      `INSERT INTO "main"."children" ("node_id", "father_id", "sequence") VALUES ('${node_id}', '${father_id}', '${sequence}')`,
    ].join(';');
  },
};

export { queries };
