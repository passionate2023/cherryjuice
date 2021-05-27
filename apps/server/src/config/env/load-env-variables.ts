import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

export const pkgEnvFilePath = path.resolve(
  process.execPath.substring(0, process.execPath.lastIndexOf('/')),
  '.env',
);
export const isPkg =
  fs.existsSync(pkgEnvFilePath) || process.env.NODE_ENV === 'developement';

const possiblePaths = [
  path.resolve(__dirname, '../../../../../.env'),
  path.resolve(__dirname, '../../../../../../.env'),
  pkgEnvFilePath,
];
for (const path of possiblePaths) {
  dotenv.config({ path });
}
