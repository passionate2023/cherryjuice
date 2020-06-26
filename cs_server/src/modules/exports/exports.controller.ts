import { Controller, Get, Injectable, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { ExportsService } from './exports.service';

@Injectable()
@Controller('/exports/')
export class ExportsController {
  constructor(private exportsService: ExportsService) {}
  @Get('/:userId/:documentId/:documentHash/:documentName')
  public exportedDocument(
    @Res() res: Response,
    @Param('userId') userId: string,
    @Param('documentId') documentId: string,
    @Param('documentHash') documentHash: string,
    @Param('documentName') documentName: string,
  ) {
    res.header('content-type', 'application/x-sqlite3');
    res.header(
      'content-disposition',
      `attachment; filename="${documentName}.ctb"`,
    );
    return this.exportsService
      .createDownloadStream({ userId, documentId, documentHash, documentName })
      .pipe(res);
  }
}
