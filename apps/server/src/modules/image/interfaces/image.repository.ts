import { Image as CTBImage } from '../../imports/helpers/import-ctb/entities/Image';

export interface IImageRepository {
  getNodeImages({
    node_id,
  }): Promise<
    Pick<CTBImage, 'node_id' | 'justification' | 'anchor' | 'png' | 'link'>[]
  >;
}
