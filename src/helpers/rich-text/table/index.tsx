type Props = {
  table: { th: string[]; td: string[][] };
  styles: { justification: string };
  other_attributes: {
    offset: number;
    col_min_width: number;
    col_max_width: number;
  };
};

const Table = ({ table: { th, td } }) => {
  return `
    <table class="modTable.table" >
      <thead>
        ${th.map(head => `<th >${head}</th>`).join('')}
      </thead>
      <tbody>
        ${td.map(
          (row, i) =>
            `<tr >
            ${row.map((definition, i) => `<td >${definition}</td>`).join('')}
          </tr>`,
        )}
      </tbody>
    </table>
  `;
};

export { Table };
