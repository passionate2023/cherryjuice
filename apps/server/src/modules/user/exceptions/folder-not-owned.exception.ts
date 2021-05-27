import { ApolloError } from 'apollo-server-express';

export class FolderNotOwnedException extends ApolloError {
  constructor(folderName: string) {
    super(`folder <${folderName}> does not belong to the user`);
  }
}
