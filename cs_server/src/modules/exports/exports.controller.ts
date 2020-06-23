import {
  Controller,
  Get,
  Injectable,
  Param,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../user/decorators/get-user.decorator';
import { User } from '../user/entities/user.entity';
import { Response } from 'express';
import { ExportsService } from './exports.service';

@Injectable()
@UseGuards(AuthGuard('jwt'))
@Controller('/exports/')
export class ExportsController {
  constructor(private exportsService: ExportsService) {}
  @Get('/:documentName')
  public exportedDocument(
    @Res() res: Response,
    @GetUser() user: User,
    @Param('documentName') documentName: string,
  ) {
    res.header('content-type', 'application/x-sqlite3');
    res.header('content-disposition', `attachment; filename="${documentName}"`);
    return this.exportsService
      .createDownloadStream({ user, documentName })
      .pipe(res);
  }
}
