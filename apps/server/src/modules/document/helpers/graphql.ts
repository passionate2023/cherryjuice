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
const GraphQLUpload = (acceptedMimeTypes: string[], TypeName: string) =>
  new GraphQLScalarType({
    name: TypeName,
    description: `The ${TypeName} scalar type represents a file upload.`,
    async parseValue(
      value: Promise<{ file: FileUpload }>,
    ): Promise<FileUpload> {
      const { file } = await value;
      if (!file) throw new GraphQLError('invalid upload');
      const stream = file.createReadStream();
      const fileType = await FileType.fromStream(stream);
      if (!acceptedMimeTypes.includes(fileType.mime))
        throw new GraphQLError(
          'Mime type should be one of: ' + acceptedMimeTypes.join(', '),
        );

      return file;
    },
    parseLiteral(ast): void {
      throw new GraphQLError('Upload literal unsupported.', ast);
    },
    serialize(): void {
      throw new GraphQLError('Upload serialization unsupported.');
    },
  });
export { GraphQLUpload };
