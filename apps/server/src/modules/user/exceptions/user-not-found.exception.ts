import { ApolloError } from 'apollo-server-express';

export class UserNotFoundException extends ApolloError {
  constructor(username: string) {
    super(`user <${username}> not found`);
  }
}
