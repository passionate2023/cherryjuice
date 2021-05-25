import { ApolloError } from 'apollo-server-express';

export class ExportNotFoundException extends ApolloError {
  constructor() {
    super(`could not find the document`);
  }
}
