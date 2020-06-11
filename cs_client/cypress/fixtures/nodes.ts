import {
  randomBoolean,
  randomInteger,
  randomHexColor,
  removeArrayElement,
} from '../support/helpers/javascript-utils';
import { generateNodeText } from './content/text';
import { createImageGenerator } from './content/image';

const generateName = (base => {
  const state = { count: 1 };
  return () => ({ name: `${base} ${state.count}`, id: state.count++ });
})('node');
const generateImage = createImageGenerator([
  'pink',
  'cyan',
  'yellow',
  'orange',
  'green',
])(['blue', 'black', 'red']);
const generateNode = (levelIndex, includeText, numberOfImages) => () => {
  const { id, name } = generateName();
  return {
    id,
    name,
    isBold: randomBoolean(),
    color: randomBoolean() ? randomHexColor() : undefined,
    icon: randomBoolean() ? randomInteger(1, 48) : 0,
    children: [],
    parent: undefined,
    levelIndex,
    ...(includeText && { text: generateNodeText({ name }) }),
    ...(!!numberOfImages && {
      images: Array.from({
        length: randomInteger(numberOfImages[0], numberOfImages[1]),
      }).map((_, i) => generateImage([`${name}`, `image ${i + 1}`])),
    }),
  };
};

const generateTree = ({ nodesPerLevel, includeText, numberOfImages }) => {
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
const deleteNodeAndItsChildren = tree => treeMap => node => {
  node.children
    .map(id => treeMap.get(id))
    .forEach(deleteNodeAndItsChildren(tree)(treeMap));
  removeArrayElement(tree[node.levelIndex], node);
};
export { generateTree, deleteNodeAndItsChildren };
