import { ApolloError } from 'apollo-server-express';

export class EmailAlreadyVerifiedException extends ApolloError {
  constructor() {
    super('email already verified');
  }
}
