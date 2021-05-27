import { ApolloError } from 'apollo-server-express';

export class UserAlreadyHasPasswordException extends ApolloError {
  constructor() {
    super('user already have a password');
  }
}
