const translateTable = ({ node }) => {
  const newNode = {};
  if (node.type === 'png') {
    newNode['type'] = 'png';
    newNode['$'] = {
      justification: 'left',
      height: +node.$['height'].match(/\d+/)[0],
      width: +node.$['width'].match(/\d+/)[0],
    };
    newNode['other_attributes'] = {
      ...node.other_attributes,
    };
  }
  if (node.type === 'table') {
    newNode['type'] = 'table';
    newNode['$'] = {
      justification: 'left',
    };
    newNode['other_attributes'] = {
      ...node.other_attributes,
    };
    newNode['table'] = {
      th: node.thead.split('\n')[0].split('\t'),
      td: node.tbody.split('\n').map(line => line.split('\t')),
    };
  } else if (node.type === 'code') {
    newNode['type'] = 'code';
    newNode['$'] = {
      justification: 'left',
      height: +node.$['min-height'].match(/\d+/)[0],
      width: +node.$['width'].match(/\d+/)[0],
    };
    newNode['other_attributes'] = {
      ...node.other_attributes,
    };
    newNode['_'] = node._;
  }
  return newNode;
};

export { translateTable };
