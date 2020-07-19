type Props = {
  column: string;
  headline: string;
};
const regexHeadline = ({ column, headline }: Props) => {
  if (headline) {
    const [start, end] = column.split(headline);
    const index = start.length;
    return {
      start,
      match: headline,
      end,
      index,
    };
  }
};

export { regexHeadline };
