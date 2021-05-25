import { ApolloError } from 'apollo-server-express';

export class CouldNotSendEmailException extends ApolloError {
  constructor() {
    super('could not send email');
  }
}
