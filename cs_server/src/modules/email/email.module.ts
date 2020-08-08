import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailService } from './email.service';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import path from 'path';
import { transporterConfig } from '../../config/email.config';

const templatesFolder = path.join(process.cwd(), 'src/modules/email/templates');

@Module({
  imports: [
    MailerModule.forRoot({
      transport: transporterConfig({ useTrap: true }),
      defaults: {
        from: process.env.EMAIL_SENDER,
      },
      template: {
        dir: templatesFolder + '/pages',
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
      options: {
        partials: {
          dir: templatesFolder + '/partials',
          options: {
            strict: true,
          },
        },
      },
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
