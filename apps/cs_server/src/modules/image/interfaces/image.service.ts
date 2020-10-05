export interface IImageService {
  getPNGFullBase64({ node_id }): Promise<string[]>;

  getPNGThumbnailBase64({ node_id }): Promise<Promise<string>[]>;
}
