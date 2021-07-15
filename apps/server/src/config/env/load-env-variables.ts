import dotenv from 'dotenv';
import path from 'path';

const possiblePaths = [
  path.resolve(__dirname, '../../../../../.env'),
  path.resolve(__dirname, '../../../../../../.env'),
];
for (const path of possiblePaths) {
  dotenv.config({ path });
}
