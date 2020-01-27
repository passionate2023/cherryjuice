import { gql } from 'apollo-server-express';

const ct_file = `
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
`;

const ct_node_meta = `
  type Ct_node_meta {
    node_id: Int
    father_id: Int
    name: String
    child_nodes: [Int]
    is_empty: Int 
    is_richtxt: Int
    has_image: Int
    has_codebox: Int
    has_table: Int
    ts_creation: Float
    ts_lastsave: Float
    node_title_styles: String
    icon_id: String
  }
`;
const ct_node_content = `
  type Ct_node_content {
    rich_txt: String
    png_thumbnail_base64(offset: Int!): String
    png_full_base64(offset: Int!): String
     node_id: Int
     html: String
    all_png_thumbnail_base64: [String]
    all_png_full_base64: [String]
  }
`;
const typeDefs = gql`
  ${ct_file}
  ${ct_node_meta}
  ${ct_node_content}
  type Query {
    ct_files(file_id: String): [Ct_file]
    ct_node_meta(file_id: String!, node_id: Int): [Ct_node_meta]
    ct_node_content(file_id: String!, node_id: Int!): [Ct_node_content]
  }
`;
export { typeDefs };
