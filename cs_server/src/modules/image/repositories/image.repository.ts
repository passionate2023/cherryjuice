import { EntityRepository, Repository } from 'typeorm';
import { Image } from '../entities/image.entity';

@EntityRepository(Image)
export class ImageRepository extends Repository<Image> {
  async getNodeImages({
    nodeId,
    thumbnail,
  }: {
    nodeId: string;
    thumbnail: boolean;
  }): Promise<Image[]> {
    return this.createQueryBuilder('image')
      .select(thumbnail ? 'image.thumbnail' : 'image.image')
      .where('image.nodeId = :nodeId', { nodeId })
      .getMany();
  }
}
