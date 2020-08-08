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
      subject: 'Password reset request',
      text: `Hello, someone has requested a password reset for the Cherryscript account associated with ${email}\nto reset your password follow this link: ${url}\nIf you didn't make this request, ignore this email.`,
      context: {
        resetPasswordUrl: url,
        email,
      },
      template: 'reset-password',
    });
  }

  async sendEmailVerification({ email, token }: SendEmailDTO): Promise<void> {
    const url = `${process.env.ASSETS_URL}/verify-email#token=${token}`;
    await this.mailerService.sendMail({
      to: email,
      subject: 'Confirm Your Email',
      text: `Hello, to confirm your email, follow this link: ${url}`,
      context: {
        verifyEmailUrl: url,
      },
      template: 'verify-email',
    });
  }
}
