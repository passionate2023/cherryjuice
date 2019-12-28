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

export type TCt_nodeImages = {
  node_id: number;
  png: string;
  offset: number;
};
export type TFile = {
  name: string;
  size: number;
  fileCreation: number;
  fileContentModification: number;
  fileAttributesModification: number;
  fileAccess: number;
  slug: string;
  id: string;
  filePath: string;
};
