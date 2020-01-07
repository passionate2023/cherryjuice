const adjustNode = ({ node, type }) => {
  switch (type) {
    case 'codebox':
      return {
        type: 'code',
        _: node.txt,
        $: {
          justification: node.justification,
          width: node.width,
          height: node.height,
        },
        other_attributes: {
          width_raw: node.width,
          offset: node.offset,
          syntax: node.syntax,
          is_width_pix: node.is_width_pix,
          do_highl_bra: node.do_highl_bra,
          o_show_linenum: node.o_show_linenum,
        },
      };
    case 'image':
      if (node.anchor) console.log('anchor!', node);
      return node.anchor
        ? {
            type: 'anchor',
            $: {
              justification: node.justification,
            },
            other_attributes: {
              id: `#${node.anchor}`,
              offset: node.offset,
            },
          }
        : {
            type: 'png',
            $: {
              justification: node.justification,
              height: node.height,
              width: node.width,
            },
            other_attributes: {
              offset: node.offset,
            },
          };
  }
};

const insertOtherTables = ({ xml: oldXml, otherTables }) => {
  // remove any empty nodes that ct uses for images/anchors/code...
  const xml = oldXml.filter(node => typeof node === 'string' || node._);
  let numberOfInsertedElements = 0;
  Object.entries(otherTables).forEach(([key, value]) => {
    (value as Array<any>).forEach(miscNode => {
      const offset = miscNode.offset;
      let totalLength = 0;
      for (const node of xml) {
        const nodeString =
          typeof node === 'string' ? node : node._ ? node._ : undefined;
        if (nodeString && !node.type) {
          const nodeLength = nodeString.length;

          const localOffset = offset - totalLength;
          if (localOffset <= nodeLength) {
            const [firstHalf, secondHalf] = [
              nodeString.substring(0, localOffset - numberOfInsertedElements),
              nodeString.substring(localOffset - numberOfInsertedElements),
            ];

            const i = xml.indexOf(node);
            const toBeInserted = [];
            if (firstHalf) toBeInserted.push(firstHalf);
            toBeInserted.push(adjustNode({ node: miscNode, type: key }));
            if (secondHalf) toBeInserted.push(secondHalf);
            xml.splice(i, 1, ...toBeInserted);
            numberOfInsertedElements++;
            break;
          } else {
            totalLength += nodeLength;
          }
        }
      }
    });
  });

  return xml;
};
// things to consider
// a node adds 3 units to the total length

export { insertOtherTables };
