export type TCt_node = {
  node_id: number;
  father_id: number;
  name: string;
  txt: string;
  is_richtxt: number;
  has_image: number;
  has_codebox: number;
  has_table: number;
  ts_creation: number;
  ts_lastsave: number;
  child_nodes: number[];
};
