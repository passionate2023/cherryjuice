import dotenv from 'dotenv';
import path from 'path';
const possiblePaths = [
  path.resolve(__dirname, '../../../.env'),
  path.resolve(__dirname, '../../../../.env'),
  path.resolve(
    process.execPath.substring(0, process.execPath.lastIndexOf('/')),
    '.env',
  ),
];
for (const path of possiblePaths) {
  dotenv.config({ path });
}
process.env.TZ = 'UTC';
