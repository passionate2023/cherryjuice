import { Controller, Get, Res } from '@nestjs/common';
import * as path from 'path';
const staticAssetsRootFolder =
  process.env.NODE_ENV === 'production'
    ? '/cs/client'
    : path.join(process.cwd(), '../cs_client/dist');
const assets = {
  ['index.html']: path.join(staticAssetsRootFolder, '/index.html'),
};
@Controller()
export class AppController {
  @Get([
    '/login*',
    '/signup*',
    '/document*',
    '/reset-password*',
    '/verify-email*',
    '/signup-oauth*',
    '/forgot-password*',
  ])
  clientSideRoutes(@Res() res) {
    res.sendFile(assets['index.html']);
  }
}

export { staticAssetsRootFolder };
