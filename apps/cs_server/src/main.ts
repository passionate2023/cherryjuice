import './config/env/load-env-variables';
import './config/env/validate-env-variables';
import './config/env/set-default-env-variables';
import fs from 'fs';
import { runMigrations } from './run-migrations';
import { bootstrapServer } from './bootstrap-server';
import { createDatabase } from './config/assistance/create-database';
import { pkgEnvFilePath } from './config/env/load-env-variables';

(async () => {
  try {
    if (!process.env.DATABASE_URL) {
      const servedFromPackage =
        process.env.NODE_ENV === 'development' || fs.existsSync(pkgEnvFilePath);
      if (servedFromPackage) await createDatabase();
    } else {
      await runMigrations();
      await bootstrapServer();
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
  }
})();
