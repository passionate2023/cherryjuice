import { ApolloError } from 'apollo-server-express';
import { GetNodeDTO } from '../dto/mutate-node.dto';

export class NodeNotFoundException extends ApolloError {
  constructor({ documentId, node_id }: GetNodeDTO) {
    super(`could not find node '${documentId}/${node_id}'`);
  }
}
