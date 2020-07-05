import fs from 'fs';
import rimraf from 'rimraf';
const deleteFolder = async (
  location: string,
  onlyDeleteContent = false,
): Promise<void> =>
  new Promise(res => {
    if (fs.existsSync(location))
      rimraf(
        `${location.replace(/\/$/, '')}${onlyDeleteContent ? '/*' : ''}`,
        err => {
          // eslint-disable-next-line no-console
          if (err) console.error(err);
          res();
        },
      );
    else res();
  });

export { deleteFolder };
