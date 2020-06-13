import { randomInteger } from '../../support/helpers/javascript-utils';
import { generateNode, NodeAst } from '../node/generate-node';

type TreeAst = NodeAst[][];

const generateTree = ({
  nodesPerLevel,
  includeText = false,
  numberOfImages = [],
}): TreeAst => {
  return Array.from({ length: nodesPerLevel.length })
    .map((_, levelIndex) =>
      Array.from({
        length: randomInteger(
          nodesPerLevel[levelIndex][0],
          nodesPerLevel[levelIndex][1]
            ? nodesPerLevel[levelIndex][1]
            : nodesPerLevel[levelIndex][0],
        ),
      }).map(generateNode(levelIndex, includeText, numberOfImages)),
    )
    .map((level, levelIndex, arr) =>
      levelIndex === 0
        ? level
        : level
            .map(node => ({
              ...node,
              parent: (() => {
                const randomParent =
                  arr[levelIndex - 1][
                    randomInteger(0, arr[levelIndex - 1].length - 1)
                  ];
                randomParent.children.push(node.id);
                return randomParent;
              })(),
            }))
            .sort((a, b) => a.parent.id - b.parent.id),
    );
};

export { generateTree };
export { TreeAst };
