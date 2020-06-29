import { DocumentSqliteRepository } from './document.sqlite.repository';
import { Image } from '../entities/Image';
import { IImageRepository } from '../../../../image/interfaces/image.repository';
import { imageQueries } from './queries/image';

export class ImageSqliteRepository implements IImageRepository {
  constructor(private documentSqliteRepository: DocumentSqliteRepository) {}

  async getNodeImages({
    node_id,
  }): Promise<
    Pick<Image, 'node_id' | 'justification' | 'anchor' | 'png' | 'link'>[]
  > {
    return this.documentSqliteRepository.sqliteAll(
      imageQueries.read.images({ node_id: node_id, offset: undefined }),
    );
  }
}
