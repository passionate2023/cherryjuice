import {
  isPresentationalTable,
  splitTableByRow,
} from '::helpers/rendering/html-to-ahtml/extractors/parse-table/parse-table';

const extractTable = (acc, el, commonAttributes, options, getAHtml) => {
  const tableOuterHTML: string = el.outerHTML;
  if (isPresentationalTable({ table: tableOuterHTML }))
    acc.push(
      ...getAHtml({
        DDOEs: splitTableByRow({ table: tableOuterHTML }),
        options,
      }).abstractHtml,
    );
  else
    acc.push(
      options.serializeNonTextElements
        ? {
            ...commonAttributes,
            type: 'table',
            outerHTML: tableOuterHTML,
          }
        : {
            type: 'table',
            table: {
              th: Array.from(el.tHead.firstElementChild.children).map(
                (el: HTMLTableRowElement) => el.innerText,
              ),
              td: Array.from(
                el.tBodies[0].children,
              ).map((row: HTMLTableRowElement) =>
                Array.from(row.children).map(
                  (el: HTMLTableDataCellElement) => el.innerText,
                ),
              ),
            },
            other_attributes: {
              // offset: state.offset++,
              col_min_width: +el.dataset.col_min_width,
              col_max_width: +el.dataset.col_max_width,
            },
          },
    );
};

export { extractTable };
