export class EmailService {
  async sendPasswordResetEmail({ token }: { token: string }): Promise<void> {
    // eslint-disable-next-line no-console
    console.log(`http://localhost:1236/reset-password#token=${token}`);
  }

  sendEmailVerificationEmail({ token }: { token: string }) {
    // eslint-disable-next-line no-console
    console.log(`http://localhost:1236/verify-email#token=${token}`);
  }
}
