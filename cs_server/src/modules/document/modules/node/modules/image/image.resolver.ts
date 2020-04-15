import { Args, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Image } from './entities/image.entity';
import { ImageService } from './image.service';

@Resolver(() => Image)
export class ImageResolver {
  constructor(private imageService: ImageService) {}

  @ResolveField()
  async image(
    @Parent() { node_id },
    @Args('offset', { nullable: true }) offset: number,
  ): Promise<string[]> {
    return this.imageService.getPNGFullBase64({
      node_id,
      offset,
    });
  }

  @ResolveField()
  async thumbnail(
    @Parent() { node_id },
    @Args('offset', { nullable: true }) offset: number,
  ): Promise<Promise<string | undefined>[]> {
    return this.imageService.getPNGThumbnailBase64({
      node_id,
      offset,
    });
  }
}
