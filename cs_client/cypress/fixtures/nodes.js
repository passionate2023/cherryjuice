import {
  randomBoolean,
  randomInteger,
  randomHexColor,
} from '../support/helpers/javascript-utils';

const generateName = (base => {
  const state = { count: 0 };
  return () => ({ name: `${base} ${state.count}`, id: state.count++ });
})('node');

const generateNode = () => ({
  ...generateName(),
  isBold: randomBoolean(),
  color: randomBoolean() ? randomHexColor() : undefined,
  icon: randomBoolean() ? randomInteger(1, 48) : 0,
});

const generateFlatTree = ({ nodesPerLevel }) => {
  return Array.from({ length: nodesPerLevel.length })
    .map((_, levelIndex) =>
      Array.from({
        length: randomInteger(
          nodesPerLevel[levelIndex][0],
          nodesPerLevel[levelIndex][1]
            ? nodesPerLevel[levelIndex][1]
            : nodesPerLevel[levelIndex][0],
        ),
      }).map(generateNode),
    )
    .map((level, levelIndex, arr) =>
      level.map(node =>
        levelIndex > 0
          ? {
              ...node,
              parent:
                arr[levelIndex - 1][
                  randomInteger(0, arr[levelIndex - 1].length - 1)
                ],
            }
          : node,
      ),
    );
};

// const firstLevelNodes = [
//   { name: generateName(), isBold: true },
//   { name: generateName(), isBold: false },
// ];
// const secondLevelNodes = [
//   {
//     name: generateName(),
//     isBold: false,
//     parentName: firstLevelNodes[0].name,
//   },
//   {
//     name: generateName(),
//     isBold: false,
//     parentName: firstLevelNodes[0].name,
//   },
//   {
//     name: generateName(),
//     isBold: false,
//     parentName: firstLevelNodes[1].name,
//   },
// ];

export { generateFlatTree };
