import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

type SendEmailDTO = {
  email: string;
  token: string;
};

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendPasswordReset({ email, token }: SendEmailDTO): Promise<void> {
    const url = `${process.env.ASSETS_URL}/reset-password#token=${token}`;
    await this.mailerService.sendMail({
      to: email,
      subject: 'Password reset',
      text: 'url to reset your password: ' + url,
      context: {
        resetPasswordUrl: url,
      },
      template: 'reset-password',
    });
  }

  async sendEmailVerification({ email, token }: SendEmailDTO): Promise<void> {
    const url = `${process.env.ASSETS_URL}/verify-email#token=${token}`;
    await this.mailerService.sendMail({
      to: email,
      subject: 'Verify your email',
      text: 'url to verify your email: ' + url,
      context: {
        verifyEmailUrl: url,
      },
      template: 'verify-email',
    });
  }
}
