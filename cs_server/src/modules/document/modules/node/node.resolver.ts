import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { NodeService } from './node.service';
import { Node } from './entities/node.entity';

@Resolver(() => Node)
export class NodeResolver {
  constructor(private nodeService: NodeService) {}

  @ResolveField()
  async html(@Parent() { node_id }): Promise<string> {
    return node_id === 0 ? '' : this.nodeService.getHtml(node_id);
  }
}
