import { ApolloError } from 'apollo-server-express';

export class EmailDoesNotMatchUsernameException extends ApolloError {
  constructor() {
    super(`could not find a user with these credentials`);
  }
}
