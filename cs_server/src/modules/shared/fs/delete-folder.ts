import fs from 'fs';
import rimraf from 'rimraf';
const deleteFolder = async (
  location: string,
  onlyDeleteContent = false,
): Promise<void> =>
  new Promise((res, rej) => {
    if (fs.existsSync(location))
      rimraf(
        `${location.replace(/\/$/, '')}${onlyDeleteContent ? '/*' : ''}`,
        err => {
          if (err) rej(err);
          res();
        },
      );
    else res();
  });

export { deleteFolder };
