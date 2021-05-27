import { ApolloError } from 'apollo-server-express';
import { GetNodeDTO } from '../dto/mutate-node.dto';

export class CantEditNodeException extends ApolloError {
  constructor({ documentId, node_id }: GetNodeDTO) {
    super(`you can't edit node '${documentId}/${node_id}'`);
  }
}
