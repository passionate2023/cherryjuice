import { Image } from '../entities/image.entity';

export interface IImageRepository {
  getNodeImages({ node_id, offset }): Promise<Image[]>;
}
