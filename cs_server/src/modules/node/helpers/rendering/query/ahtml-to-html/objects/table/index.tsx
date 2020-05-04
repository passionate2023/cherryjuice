import { escapeHtml } from '../../../../../html';

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
  other_attributes: { col_min_width, col_max_width },
}: Props) => {
  return `<table class="rich-text__table" 
        data-col_max_width="${col_max_width}"
        data-col_min_width="${col_min_width}"
        >
      <thead>
        ${th.map(head => `<th >${escapeHtml(head)}</th>`).join('')}
      </thead>
      <tbody>
        ${td
          .map(
            row =>
              `<tr >
            ${row
              .map(definition => `<td >${escapeHtml(definition)}</td>`)
              .join('')}
          </tr>`,
          )
          .join('')}
      </tbody>
    </table>`;
};

export { Table };
