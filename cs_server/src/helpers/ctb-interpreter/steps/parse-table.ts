const parseTable = ({ xmlTable }) => {
  // console.log('inside parseTable',{xmlTable});
  const td = xmlTable.table.row.map(({ cell }) => cell);
  const th = td.pop();
  return {
    td,
    th
  };
};
export { parseTable };
