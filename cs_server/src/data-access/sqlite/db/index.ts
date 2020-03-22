import * as sqlite from 'sqlite';

const db = (() => {
  return {
    open: async filePath => await sqlite.open(filePath),
  };
})();

export { db };
