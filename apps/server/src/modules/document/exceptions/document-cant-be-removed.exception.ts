import { ApolloError } from 'apollo-server-express';

export class DocumentCantBeRemovedException extends ApolloError {
  constructor() {
    super(`you can not remove this document`);
  }
}
