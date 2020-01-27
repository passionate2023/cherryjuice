import express from 'express';
import * as sqlite from 'sqlite';
import { ctbQuery } from '../helpers/ctb-content';
import imageThumbnail from 'image-thumbnail';
const createRouter = ({ resolversState: state }) => {
  const router = express.Router();
  router.get('/png/:file_id/:node_id/:offset/:percentage', async function(
    req,
    res,
  ) {
    const { file_id, node_id, offset, percentage } = req.params;
    console.log({ file_id, node_id, offset });
    console.log(state.files.get(file_id).filePath);
    const db = await sqlite.open(state.files.get(file_id).filePath);
    const img = await db
      .all(ctbQuery.images({ node_id: node_id, offset }))
      .then(
        nodes =>
          nodes.map(({ anchor, png }) => {
            return anchor
              ? null
              : imageThumbnail(png, { percentage, responseType: 'buffer' });
          })[0],
      )
      .catch(console.error);
    console.log({ img });
    if (img) {
      res.writeHead(200, {
        'Content-Type': 'image/png',
        'Content-Length': img.length,
      });
      res.end(img);
    } else {
      res.end('not found');
    }
  });
  return router;
};
export { createRouter as createRouterPNG };
