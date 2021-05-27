export const assertNumberOfNodes = ({
  nOfDomNodes,
  nOfAstNodes,
}: {
  nOfDomNodes: number;
  nOfAstNodes: number;
}) => {
  expect(nOfDomNodes).equal(nOfAstNodes);
};
