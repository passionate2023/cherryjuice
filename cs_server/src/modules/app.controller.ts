import { Controller, Get, Res } from '@nestjs/common';
import * as path from 'path';
const staticAssetsRootFolder =
  process.env.NODE_ENV === 'production'
    ? path.join(__dirname, '../../client')
    : path.join(process.cwd(), '../cs_client/dist');
const assets = {
  ['index.html']: path.join(staticAssetsRootFolder, '/index.html'),
};
@Controller()
export class AppController {
  @Get(['/login*', '/signup*', '/document*'])
  clientSideRoutes(@Res() res) {
    res.sendFile(assets['index.html']);
  }
}