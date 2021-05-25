import * as os from 'os';
import path from 'path';

const paths = {
  importsFolder: path.join(os.tmpdir(), 'cj', 'imports'),
  exportsFolder: path.join(os.tmpdir(), 'cj', 'exports'),
};

export { paths };
