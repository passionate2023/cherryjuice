import { ApolloError } from 'apollo-server-express';

export class InvalidFormValueException extends ApolloError {
  constructor(message?: string) {
    super(message || 'invalid input');
  }
}
