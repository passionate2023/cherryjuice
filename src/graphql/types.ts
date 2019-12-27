import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type PngMeta {
    offset: Int
    node_id: Int
    anchor: String
    width: Int
    height: Int
    thumbnail: String
  }

  type Ct_node {
    node_id: Int
    father_id: Int
    name: String
    txt: String
    is_richtxt: Int
    has_image: Int
    has_codebox: Int
    has_table: Int
    ts_creation: Float
    ts_lastsave: Float
    child_nodes: [Int]
    rich_txt: String
    png: [PngMeta]
    has_txt: Boolean
  }

  type Ct_file {
    name: String
    size: Int
    fileCreation: Float
    fileContentModification: Float
    fileAttributesModification: Float
    fileAccess: Float
    slug: String
    id: String
    filePath: String
  }

  type Query {
    ct_nodes(file_id: String!, node_id: Int): [Ct_node]
    base64(node_id: Int, offset: Int): String
    ct_files: [Ct_file]
  }
`;
export { typeDefs };
