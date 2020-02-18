import { stringifyStyles } from '../element';

type Props = {
  table: { th: string[]; td: string[][] };
  styles: { justification: string };
  other_attributes: {
    offset: number;
    col_min_width: number;
    col_max_width: number;
  };
};

const Table = ({
  table: { th, td },
  styles,
  other_attributes: { col_min_width, col_max_width },
}) => {
  return `<table class="rich-text__table" 
        data-col_max_width="${col_max_width}"
        data-col_min_width="${col_min_width}"
        style="${stringifyStyles(styles, 'margin')} }">
      <thead>
        ${th.map(head => `<th >${head}</th>`).join('')}
      </thead>
      <tbody>
        ${td
          .map(
            (row, i) =>
              `<tr >
            ${row.map((definition, i) => `<td >${definition}</td>`).join('')}
          </tr>`,
          )
          .join('')}
      </tbody>
    </table>`;
};

export { Table };
