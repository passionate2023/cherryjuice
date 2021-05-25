import { ApolloError } from 'apollo-server-express';

export class CouldNotSaveUserDataException extends ApolloError {
  constructor() {
    super('could not save user data');
  }
}
