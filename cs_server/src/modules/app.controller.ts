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
    '/auth/login*',
    '/auth/signup*',
    '/document*',
    '/auth/reset-password*',
    '/verify-email*',
    '/auth/signup-oauth*',
    '/change-email*',
    '/auth/forgot-password*',
  ])
  clientSideRoutes(@Res() res) {
    res.sendFile(assets['index.html']);
  }
}

export { staticAssetsRootFolder };
