import { stringToSingleElement } from '::root/components/editor/helpers/execK/helpers';

const splitTableByRow = ({ table }: { table: string }): Node[] => {
  const res = [];
  const tableElement: HTMLTableElement = stringToSingleElement(
    table,
  ) as HTMLTableElement;
  Array.from(tableElement.tBodies[0].rows).forEach(tr => {
    res.push(document.createElement('br'));
    res.push(
      // @ts-ignore
      ...Array.from(tr.cells).flatMap(cell =>
        Array.from(cell.childNodes).reduce(
          (acc, node) => (
            node.nodeType === Node.TEXT_NODE
              ? /^(\s+|)$/.test(node.wholeText)
                ? undefined
                : acc.push(node)
              : acc.push(node),
            acc
          ),
          [],
        ),
      ),
    );
  });
  return res;
};

const isPresentationalTable = ({ table }: { table: string }): boolean =>
  /(role="presentation|<\s*img.*\/*>)/.test(table);

export { splitTableByRow, isPresentationalTable };
