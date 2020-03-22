import * as fs from 'fs';

const allowConsoleLogs = process.env.NODE_ENV === 'development';
const tap = label => val => (
  // eslint-disable-next-line no-console
  allowConsoleLogs && console.log(label, JSON.stringify(val, null, 4)), val
);

const writeEffect = name => {
  const state = {
    writeEffect: {
      lastException: 0,
    },
  };
  return data => {
    try {
      fs.writeFileSync(`d:\\cs_wb\\${name}.txt`, JSON.stringify(data, null, 4));
    } catch {
      fs.mkdirSync('d:\\cs_wb\\');
      if (state.writeEffect.lastException - new Date().getTime() > 1000) {
        state.writeEffect.lastException = new Date().getTime();
        writeEffect(name)(data);
      }
    }
  };
};

export { tap, writeEffect };
