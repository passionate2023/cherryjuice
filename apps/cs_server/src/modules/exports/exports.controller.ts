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
    const fileStream = this.exportsService.createDownloadStream({
      userId,
      documentId,
      documentHash,
      documentName,
    });
    if (fileStream) {
      res.header('content-type', 'application/x-sqlite3');
      res.header(
        'content-disposition',
        `attachment; filename="${documentName}.ctb"`,
      );
      return fileStream.pipe(res);
    }
  }
}
