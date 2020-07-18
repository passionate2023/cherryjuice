import { SearchOptions } from '::types/graphql/generated';

type Props = {
  searchOptions: SearchOptions;
  query: string;
  column: string;
};
const simpleHeadline = ({
  searchOptions: { fullWord, caseSensitive },
  query,
  column,
}: Props) => {
  const reg = new RegExp(
    `${fullWord ? '\\b' : ''}${query}${fullWord ? '\\b' : ''}`,
    caseSensitive ? '' : 'i',
  );
  const execArray = reg.exec(column);
  if (execArray && execArray[0]) {
    const match = execArray[0];
    const index = execArray.index;
    return {
      start: column.substring(0, index),
      match,
      end: column.substring(index + match.length),
      index,
    };
  }
};

export { simpleHeadline };
