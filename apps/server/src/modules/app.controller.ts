import { Controller, Get } from '@nestjs/common';
// import * as path from 'path';

// const assets = {
//   ['index.html']: path.join(process.env.ASSETS_PATH, '/index.html'),
// };

@Controller()
export class AppController {
  // @Get([
  //   '/auth/login*',
  //   '/auth/signup*',
  //   '/document*',
  //   '/auth/reset-password*',
  //   '/auth/signup-oauth*',
  //   '/auth/forgot-password*',
  // ])
  // clientSideRoutes(@Res() res) {
  //   res.sendFile(assets['index.html']);
  // }

  @Get('ping')
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  ping() {}
}
