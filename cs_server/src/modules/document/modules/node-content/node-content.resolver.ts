import { Args, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { NodeContentService } from './node-content.service';
import { NodeContent } from './node-content.entity';

@Resolver(() => NodeContent)
export class NodeContentResolver {
  constructor(private nodeContentService: NodeContentService) {}

  @ResolveField()
  async html(@Parent() { node_id }): Promise<string> {
    return this.nodeContentService.getHtml(node_id);
  }

  @ResolveField()
  async png(
    @Parent() { node_id },
    @Args('offset', { nullable: true }) offset: number,
  ): Promise<string[]> {
    return this.nodeContentService.getPNGFullBase64({
      node_id,
      offset,
    });
  }

  @ResolveField()
  async png_thumbnail(
    @Parent() { node_id },
    @Args('offset', { nullable: true }) offset: number,
  ): Promise<Promise<string | undefined>[]> {
    return this.nodeContentService.getPNGThumbnailBase64({
      node_id,
      offset,
    });
  }
}
