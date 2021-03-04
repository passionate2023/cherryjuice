import { ApolloError } from 'apollo-server-express';

export class EmailIdenticalToCurrentException extends ApolloError {
  constructor(email: string) {
    super(`<${email}> is already your current email`);
  }
}
