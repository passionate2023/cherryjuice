import './config/env/load-env-variables';
import './config/env/validate-env-variables';
import './config/env/set-default-env-variables';
import { runMigrations } from './run-migrations';
import { bootstrapServer } from './bootstrap-server';
import { createDatabase } from './config/assistance/create-database';
import { isPkg } from './config/env/load-env-variables';

(async () => {
  try {
    if (!process.env.DATABASE_URL) {
      if (isPkg) await createDatabase();
    } else {
      await runMigrations();
      await bootstrapServer();
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
  }
})();
