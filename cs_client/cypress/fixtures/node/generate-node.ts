import {
  randomBoolean,
  randomHexColor,
  randomInteger,
} from '../../support/helpers/javascript-utils';
import {
  createImageGenerator,
  ImageAst,
} from './generate-node-content/image/generate-image';
import { generateNodeText } from './generate-node-content/text/generate-text';

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

type NodeAst = {
  id: number;
  name: string;
  isBold: boolean;
  color?: string;
  icon: number;
  levelIndex: number;
  children: number[];
  parent?: NodeAst;
  text: string;
  images: ImageAst[];
};

const generateNode = (
  levelIndex,
  includeText,
  numberOfImages,
) => (): NodeAst => {
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
    text: includeText ? generateNodeText({ name }) : '',
    images: numberOfImages.length
      ? Array.from({
          length: randomInteger(numberOfImages[0], numberOfImages[1]),
        }).map((_, i, arr) =>
          generateImage({
            format: 'random',
            texts: [`${name}`, `image ${i + 1}`],
            bottomRightCornerWaterMark: `/${arr.length}`,
          }),
        )
      : [],
  };
};

export { generateNode };
export { NodeAst };
