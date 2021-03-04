import { ApolloError } from 'apollo-server-express';

export class InvalidSearchTargetException extends ApolloError {
  constructor() {
    super(`invalid search target`);
  }
}
