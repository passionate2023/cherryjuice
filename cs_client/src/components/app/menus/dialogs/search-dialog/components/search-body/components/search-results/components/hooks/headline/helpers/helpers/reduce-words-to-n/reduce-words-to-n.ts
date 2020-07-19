type ReduceWordsToNConfig = {
  nOfWordsToLeave: number;
  startFromEnd: boolean;
};
const reduceWordsToN = ({
  nOfWordsToLeave,
  startFromEnd,
}: ReduceWordsToNConfig) => {
  const pattern = `${startFromEnd ? '' : '^'}\\s*([^\\s]+\\s*){${nOfWordsToLeave}}${
    startFromEnd ? '$' : ''
  }`;
  return (words = '') => {
    const reg = new RegExp(pattern).exec(words);
    if (reg) return reg[0];
    else return words;
  };
};

export { reduceWordsToN };
export { ReduceWordsToNConfig };
