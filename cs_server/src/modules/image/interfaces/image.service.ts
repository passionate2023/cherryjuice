export interface IImageService {
  getPNGFullBase64({ node_id, offset }): Promise<string[]>;

  getPNGThumbnailBase64({ node_id, offset }): Promise<Promise<string>[]>;
}
