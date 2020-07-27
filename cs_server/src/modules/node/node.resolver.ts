import { Args, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { NodeService } from './node.service';
import { Node } from './entities/node.entity';
import { ImageService } from '../image/image.service';
import { Image } from '../image/entities/image.entity';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../user/guards/graphql.guard';
import { GetUserGql } from '../user/decorators/get-user.decorator';
import { User } from '../user/entities/user.entity';

@UseGuards(GqlAuthGuard)
@Resolver(() => Node)
export class NodeResolver {
  constructor(
    private nodeService: NodeService,
    private imageService: ImageService,
  ) {}

  @ResolveField()
  async html(@GetUserGql() user: User, @Parent() node: Node): Promise<string> {
    return node.node_id === 0
      ? ''
      : this.nodeService.getHtml({
          documentId: node.documentId,
          node_id: node.node_id,
          userId: user.id,
        });
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
