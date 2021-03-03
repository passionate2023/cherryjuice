import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
if (!process.env.JWT_SECRET)
  dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });
process.env.TZ = 'UTC';
