import { Args, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { NodeService } from './node.service';
import { Node } from './entities/node.entity';
import { ImageService } from '../image/image.service';
import { Image } from '../image/entities/image.entity';

@Resolver(() => Node)
export class NodeResolver {
  constructor(
    private nodeService: NodeService,
    private imageService: ImageService,
  ) {}

  @ResolveField()
  async html(@Parent() { node_id, documentId }): Promise<string> {
    return node_id === 0 ? '' : this.nodeService.getHtml(node_id, documentId);
  }
  @ResolveField(() => [Image])
  async image(
    @Parent() { id: nodeId },
    @Args('thumbnail', { nullable: true }) thumbnail: boolean,
  ): Promise<Promise<Image>[] | Image[]> {
    return thumbnail
      ? this.imageService.getPNGThumbnailBase64({
          nodeId,
        })
      : this.imageService.getPNGFullBase64({
          nodeId,
        });
  }
}
