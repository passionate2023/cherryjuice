import { Node } from '../../../../../node/entities/node.entity';

const generateRootNode = () =>
  (({
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
  } as unknown) as Node);

export { generateRootNode };
