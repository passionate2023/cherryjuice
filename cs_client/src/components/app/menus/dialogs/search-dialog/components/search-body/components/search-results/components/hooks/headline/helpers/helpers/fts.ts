type Props = {
  headline: string;
};
const ftsHeadline = ({ headline }: Props) => {
  const [start, match, end] = headline.split('<#>');
  const index = headline.indexOf('<#>') + 3;
  if (match) {
    return {
      start,
      match,
      end,
      index,
    };
  }
};

export { ftsHeadline };
