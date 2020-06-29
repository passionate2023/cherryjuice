import fs from 'fs';
import path from 'path';

const deleteFolder = (location: string): void => {
  if (fs.existsSync(location)) {
    fs.readdirSync(location).forEach(file => {
      const curPath = path.resolve(location, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        // recurse
        deleteFolder(curPath);
      } else {
        // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(location);
  }
};

export { deleteFolder };
