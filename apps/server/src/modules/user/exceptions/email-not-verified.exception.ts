import { ApolloError } from 'apollo-server-express';

export class EmailNotVerifiedException extends ApolloError {
  constructor() {
    super('email not verified');
  }
}
