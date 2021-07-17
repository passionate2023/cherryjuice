import { ApolloError } from 'apollo-server-express';

export class CouldNotSendEmailException extends ApolloError {
  constructor(e: Error) {
    super('could not send email', e.message, e);
  }
}
