import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { UserTokenMeta } from '../user/entities/user-token.entity';
import { CouldNotSendEmailException } from '../user/exceptions/could-not-send-email.exception';

type SendEmailDTO = {
  email: string;
  token: string;
};

const onRejected = () => {
  throw new CouldNotSendEmailException();
};

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendPasswordReset({ email, token }: SendEmailDTO): Promise<void> {
    const url = `${process.env.ASSETS_URL}/#${token}`;
    await this.mailerService
      .sendMail({
        to: email,
        subject: 'Password reset request',
        text: `Hello, someone has requested a password reset for the CherryJuice account associated with ${email}\nto reset your password follow this link: ${url}\nIf you didn't make this request, ignore this email.`,
        context: {
          resetPasswordUrl: url,
          email,
        },
        template: 'reset-password',
      })
      .catch(onRejected);
  }

  async sendEmailVerification({ email, token }: SendEmailDTO): Promise<void> {
    const url = `${process.env.ASSETS_URL}/#${token}`;
    await this.mailerService
      .sendMail({
        to: email,
        subject: 'Confirm your email',
        text: `Hello, to confirm your email, follow this link: ${url}`,
        context: {
          verifyEmailUrl: url,
        },
        template: 'verify-email',
      })
      .catch(onRejected);
  }

  async sendEmailChange({
    email,
    token,
    tokenMeta,
  }: SendEmailDTO & {
    tokenMeta: UserTokenMeta;
  }): Promise<void> {
    const url = `${process.env.ASSETS_URL}/#${token}`;
    await this.mailerService
      .sendMail({
        to: email,
        subject: 'Change your email address',
        text: [
          `Hello,`,
          `We've received a request to change your email from ${tokenMeta.currentEmail} to ${tokenMeta.newEmail}.`,
          `By clicking the following link, you are confirming this request.`,
          ` ${url} `,
          `If you didn't make this request, let us know`,
          `Thanks`,
        ].join('\n'),
        context: {
          changeEmailUrl: url,
          currentEmail: tokenMeta.currentEmail,
          newEmail: tokenMeta.newEmail,
        },
        template: 'change-email',
      })
      .catch(onRejected);
  }
}
