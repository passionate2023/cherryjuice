import { EntityRepository, Repository } from 'typeorm';
import { Image } from '../entities/image.entity';
import { IImageRepository } from '../interfaces/image.repository';

@EntityRepository(Image)
export class ImageRepository extends Repository<Image>
  implements IImageRepository {
  getNodeImages({
    node_id,
    offset,
  }: {
    node_id: any;
    offset: any;
  }): Promise<Image[]> {
    return Promise.resolve([]);
  }
}
