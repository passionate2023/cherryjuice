import * as fs from 'fs';

const state = {
  writeEffect: {
    lastException: 0,
  },
};
const writeEffect = name => data => {
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

export { writeEffect };
