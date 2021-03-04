import { ApolloError } from 'apollo-server-express';

export class InvalidTokenException extends ApolloError {
  constructor() {
    super('invalid token');
  }
}
