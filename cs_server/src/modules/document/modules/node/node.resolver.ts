import { Args, Int, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { NodeService } from './node.service';
import { Node } from './entities/node.entity';
import { ImageService } from './modules/image/image.service';

@Resolver(() => Node)
export class NodeResolver {
  constructor(
    private nodeService: NodeService,
    private imageService: ImageService,
  ) {}

  @ResolveField()
  async html(@Parent() { node_id }): Promise<string> {
    return node_id === 0 ? '' : this.nodeService.getHtml(node_id);
  }
  @ResolveField()
  async image(
    @Parent() { node_id },
    @Args('offset', { nullable: true, type: () => Int }) offset: number,
    @Args('thumbnail', { nullable: true }) thumbnail: boolean,
  ): Promise<Promise<string>[] | string[]> {
    return thumbnail
      ? this.imageService.getPNGThumbnailBase64({
          node_id,
          offset,
        })
      : this.imageService.getPNGFullBase64({
          node_id,
          offset,
        });
  }
}
