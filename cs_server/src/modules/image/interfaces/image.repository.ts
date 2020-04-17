import { Image as CTBImage } from '../../document/helpers/copy-ctb/entities/Image';

export interface IImageRepository {
  getNodeImages({
    node_id,
    offset,
  }): Promise<
    Pick<
      CTBImage,
      'node_id' | 'offset' | 'justification' | 'anchor' | 'png' | 'link'
    >[]
  >;
}
