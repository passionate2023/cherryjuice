import { readOperations } from './read';
import { write } from './write';

const ctb = {
  ...readOperations,
  write,
};

export { ctb };
