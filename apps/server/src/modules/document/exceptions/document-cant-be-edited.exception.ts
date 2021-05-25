import { ApolloError } from 'apollo-server-express';

export class DocumentCantBeEditedException extends ApolloError {
  constructor(documentName: string) {
    super(`you can not edit document '${documentName}'`);
  }
}
