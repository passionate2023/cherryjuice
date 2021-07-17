import './config/env/load-env-variables';
import './config/env/validate-env-variables';
import './config/env/set-default-env-variables';
import { runMigrations } from './run-migrations';
import { bootstrapServer } from './bootstrap-server';

(async () => {
  try {
    await runMigrations();
    await bootstrapServer();
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
  }
})();
