import { ApolloError } from 'apollo-server-express';
import { GetNodeDTO } from '../dto/mutate-node.dto';

export class NodeIsReadonlyException extends ApolloError {
  constructor({ documentId, node_id }: GetNodeDTO) {
    super(`node '${documentId}/${node_id}' is ready-only`);
  }
}
