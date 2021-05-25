import dotenv from 'dotenv';
import path from 'path';

export const pkgEnvFilePath = path.resolve(
  process.execPath.substring(0, process.execPath.lastIndexOf('/')),
  '.env',
);
const possiblePaths = [
  path.resolve(__dirname, '../../../../../.env'),
  path.resolve(__dirname, '../../../../../../.env'),
  pkgEnvFilePath,
];
for (const path of possiblePaths) {
  dotenv.config({ path });
}
