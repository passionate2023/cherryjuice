const fileId = `c035fc55db340f6e5e1254c4bfc4400d`;
const nodes = [
  [
    1,
    `<div class='rich-text__line' style=''><div class='rich-text__text' style='color:#ff0000;'>red text</div></div>`,
  ],
];
const toNode = ([node_id, html]) => [
  `{"operationName":"ct_node_rt_png_meta","variables":{"file_id":"c035fc55db340f6e5e1254c4bfc4400d","node_id":${node_id}},"query":"query ct_node_rt_png_meta($file_id: String!, $node_id: Int!) {\\n  ct_node_content(file_id: $file_id, node_id: $node_id) {\\n    html\\n    node_id\\n    __typename\\n  }\\n}\\n"}`,
  `{"data":{"ct_node_content":[{"html":"${html}","node_id":${node_id},"__typename":"Ct_node_content"}]}}`,
];

const graphqlFixtures = new Map(
  [
    [
      `{"operationName":"ct_node_meta","variables":{"file_id":"c035fc55db340f6e5e1254c4bfc4400d"},"query":"query ct_node_meta($file_id: String!) {\\n  ct_node_meta(file_id: $file_id) {\\n    node_id\\n    father_id\\n    name\\n    child_nodes\\n    is_empty\\n    is_richtxt\\n    has_image\\n    has_codebox\\n    has_table\\n    ts_creation\\n    ts_lastsave\\n    node_title_styles\\n    icon_id\\n    __typename\\n  }\\n}\\n"}`,
      `{"data":{"ct_node_meta":[{"node_id":1,"father_id":0,"name":"node 1","child_nodes":[],"is_empty":0,"is_richtxt":1,"has_image":0,"has_codebox":0,"has_table":0,"ts_creation":1583905087.291,"ts_lastsave":1583905255.603,"node_title_styles":"{\\"color\\":\\"#ffffff\\",\\"fontWeight\\":\\"normal\\"}","icon_id":"0","__typename":"Ct_node_meta"},{"node_id":0,"father_id":-1,"name":"root","child_nodes":[1],"is_empty":null,"is_richtxt":0,"has_image":0,"has_codebox":0,"has_table":0,"ts_creation":0,"ts_lastsave":0,"node_title_styles":"{\\"color\\":\\"#ffffff\\",\\"fontWeight\\":\\"normal\\"}","icon_id":"0","__typename":"Ct_node_meta"}]}}`,
    ],
    [
      `{"operationName":"ct_node_rt_png_meta","variables":{"node_id":1,"file_id":"c035fc55db340f6e5e1254c4bfc4400d"},"query":"query ct_node_rt_png_meta($file_id: String!, $node_id: Int!) {\\n  ct_node_content(file_id: $file_id, node_id: $node_id) {\\n    all_png_thumbnail_base64\\n    node_id\\n    __typename\\n  }\\n}\\n"}`,
      `{"data":{"ct_node_content":[{"all_png_thumbnail_base64":[],"node_id":1,"__typename":"Ct_node_content"}]}}`,
    ],
    [
      `{"operationName":"ct_node_rt_png_meta","variables":{"node_id":1,"file_id":"c035fc55db340f6e5e1254c4bfc4400d"},"query":"query ct_node_rt_png_meta($file_id: String!, $node_id: Int!) {\\n  ct_node_content(file_id: $file_id, node_id: $node_id) {\\n    all_png_full_base64\\n    node_id\\n    __typename\\n  }\\n}\\n"}`,
      `{"data":{"ct_node_content":[{"all_png_full_base64":[],"node_id":1,"__typename":"Ct_node_content"}]}}`,
    ],
    [
      `{"operationName":"ct_files","variables":{},"query":"query ct_files($file_id: String) {\\n  ct_files(file_id: $file_id) {\\n    name\\n    size\\n    fileCreation\\n    fileContentModification\\n    fileAccess\\n    slug\\n    id\\n    filePath\\n    __typename\\n  }\\n}\\n"}`,
      `{"data":{"ct_files":[ {"name":"empty-file.ctb","size":12288,"fileCreation":1583905129356.1296,"fileContentModification":1583905130447.9128,"fileAccess":1583905130447.9128,"slug":"empty-file","id":"c035fc55db340f6e5e1254c4bfc4400d","filePath":"D:\\\\Workspace\\\\Dev\\\\Web\\\\js\\\\prototyping\\\\cherryscript\\\\ctb\\\\empty-file.ctb","__typename":"Ct_file"}
    ]}}`,
    ],
    ...nodes.map(toNode),
  ].map(([key, value]) => [key, JSON.parse(value)]),
);
const getAppropriateData = postRequestBody => {
  return graphqlFixtures.get(postRequestBody);
};
export { getAppropriateData, graphqlFixtures, fileId };
