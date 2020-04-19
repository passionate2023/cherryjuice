import * as FileType from 'file-type';
import { GraphQLError, GraphQLScalarType } from 'graphql';
import { Readable } from 'stream';

export interface FileUpload {
  filename: string;
  mimetype: string;
  encoding: string;
  createReadStream: () => Readable;
}
//https://stackoverflow.com/questions/60059940/graphql-apollo-upload-in-nestjs-returns-invalid-value
const GraphQLUpload = (acceptedMimeTypes: string[]) =>
  new GraphQLScalarType({
    name: 'Upload',
    description: 'The `Upload` scalar type represents a file upload.',
    async parseValue(value: Promise<FileUpload>): Promise<FileUpload> {
      const upload = await value;
      const stream = upload.createReadStream();
      const fileType = await FileType.fromStream(stream);
      if (!acceptedMimeTypes.includes(fileType.mime))
        throw new GraphQLError('Mime type does not match file content.');

      return upload;
    },
    parseLiteral(ast): void {
      throw new GraphQLError('Upload literal unsupported.', ast);
    },
    serialize(): void {
      throw new GraphQLError('Upload serialization unsupported.');
    },
  });
export { GraphQLUpload };
