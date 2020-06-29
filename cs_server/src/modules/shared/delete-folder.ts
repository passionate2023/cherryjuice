import fs from 'fs';
import path from 'path';

const deleteFolder = async (
  location: string,
  onlyDeleteContent = false,
): Promise<void> =>
  new Promise(res => {
    if (fs.existsSync(location)) {
      Promise.all(
        fs.readdirSync(location).map(
          file =>
            new Promise(res => {
              const curPath = path.resolve(location, file);
              if (fs.lstatSync(curPath).isDirectory()) {
                deleteFolder(curPath).then(res);
              } else {
                fs.unlink(curPath, res);
              }
            }),
        ),
      ).then(() => {
        if (!onlyDeleteContent)
          fs.rmdirSync(location, {
            maxRetries: 10,
            retryDelay: 100,
            recursive: true,
          } as any);
        res();
      });
    }
  });

export { deleteFolder };
