import { ApolloError } from 'apollo-server-express';

export class DocumentNotExistException extends ApolloError {
  constructor(documentName: string) {
    super(`could not find document '${documentName}' in your library`);
  }
}
