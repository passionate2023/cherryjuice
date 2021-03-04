import { ApolloError } from 'apollo-server-express';

export class NotLoggedInException extends ApolloError {
  constructor() {
    super('please login to perform this action');
  }
}
