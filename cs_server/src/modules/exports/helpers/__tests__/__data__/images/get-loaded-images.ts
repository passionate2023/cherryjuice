import fs from 'fs';
import path from 'path';
import { UnloadedImageRow } from '../../../helpers/ahtml-to-ctb/helpers/translate-ahtml/helpers/translate-object/objects/image';

type LoadedImages = Map<string, Buffer>;
const getLoadedImages = async (
  imageRows: UnloadedImageRow[],
): Promise<LoadedImages> =>
  new Map(
    imageRows.map(row => {
      return [
        row.png.id,
        fs.readFileSync(path.resolve(__dirname, './image_01.png')),
      ];
    }),
  );

export { getLoadedImages };
export { LoadedImages };
