import { ApolloError } from 'apollo-server-express';

export class InvalidPasswordException extends ApolloError {
  constructor() {
    super('invalid password');
  }
}
