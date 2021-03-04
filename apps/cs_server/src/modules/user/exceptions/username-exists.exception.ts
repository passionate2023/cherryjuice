import { ApolloError } from 'apollo-server-express';

export class UsernameExistsException extends ApolloError {
  constructor() {
    super('username or email exists');
  }
}
