export class EmailService {
  async sendPasswordResetEmail({ token }: { token: string }): Promise<void> {
    // eslint-disable-next-line no-console
    console.log(`http://localhost:1236/reset-password#token=${token}`);
  }
}
