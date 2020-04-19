import { EntityRepository, Repository } from 'typeorm';
import { Image } from '../entities/image.entity';
import { Image as CTBImage } from '../../document/helpers/copy-ctb/entities/Image';
import { IImageRepository } from '../interfaces/image.repository';

@EntityRepository(Image)
export class ImageRepository extends Repository<Image>
  implements IImageRepository {
  async getNodeImages({
    node_id,
    offset,
  }: {
    node_id: any;
    offset: any;
  }): Promise<
    Pick<
      CTBImage,
      'node_id' | 'offset' | 'justification' | 'anchor' | 'png' | 'link'
    >[]
  > {
    return Promise.resolve([]);
  }
}
