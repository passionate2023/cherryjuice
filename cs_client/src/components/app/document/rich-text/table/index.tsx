import modTable from '::sass-modules/table.scss'
import * as React from 'react';

type Props = {
  table: { th: string[]; td: string[][] };
  styles: { justification: string };
  other_attributes: {
    offset: number;
    col_min_width: number;
    col_max_width: number;
  };
};

const Table: React.FC<Props> = ({ table: { th, td } }) => {
  return (
    <table className={modTable.table} >
      <thead>
        {th.map((head,i) => (
          <th key={i}>{head}</th>
        ))}
      </thead>
      <tbody>
        {td.map((row,i) => (
          <tr key={i}>
            {row.map((definition,i) => (
              <td key={i}>{definition}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export { Table };
