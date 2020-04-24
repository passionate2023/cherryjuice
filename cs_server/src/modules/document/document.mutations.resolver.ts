import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../user/guards/graphql.guard';
import { Args, Mutation, ResolveField, Resolver } from '@nestjs/graphql';
import { NodeService } from '../node/node.service';
import { DocumentService } from './document.service';
import { FileUpload, GraphQLUpload } from './helpers/graphql';
import { GetUserGql } from '../user/decorators/get-user.decorator';
import { User } from '../user/entities/user.entity';
import { createWriteStream } from 'fs';
import { DocumentMutation } from './entities/document-mutation.entity';
import { UploadLinkInputType } from './input-types/upload-link.input-type';
import { UploadsService } from './uploads.service';
import { DeleteDocumentInputType } from './input-types/delete-document.input-type';

@UseGuards(GqlAuthGuard)
@Resolver(() => DocumentMutation)
export class DocumentMutationsResolver {
  constructor(
    private nodeService: NodeService,
    private documentService: DocumentService,
    private uploadsService: UploadsService,
  ) {}

  @Mutation(() => DocumentMutation)
  document(): {} {
    return {};
  }

  @ResolveField(() => Boolean)
  uploadFile(
    @Args({
      name: 'file',
      type: () => GraphQLUpload(['application/x-sqlite3']),
    })
    { createReadStream, filename }: FileUpload,
    @GetUserGql() user: User,
  ): boolean {
    const filePath = `${process.env.UPLOADS_PATH}${filename}`;
    new Promise((resolve, reject) =>
      createReadStream()
        .pipe(createWriteStream(filePath))
        .on('finish', () => resolve(true))
        .on('error', () => reject(false)),
    )
      .then(() => {
        this.documentService
          .saveDocument({
            user,
            fileName: filename,
            filePath,
          })
          // eslint-disable-next-line no-console
          .catch(e => console.error(e));
      })
      // eslint-disable-next-line no-console
      .catch(e => console.error(e));

    return true;
  }

  @ResolveField(() => Boolean)
  async uploadLink(
    @Args({
      name: 'file',
      type: () => UploadLinkInputType,
    })
    { IDs, access_token }: UploadLinkInputType,
    @GetUserGql() user: User,
  ): Promise<boolean> {
    const downloadedFiles = await this.uploadsService.downloadFileFromGDrive({
      access_token,
      fileIds: IDs,
    });
    for (const fileName of downloadedFiles) {
      await this.documentService.saveDocument({
        user,
        fileName: fileName,
        filePath: '/uploads/' + fileName,
      });
    }
    return true;
  }

  @ResolveField(() => String)
  async deleteDocument(
    @Args({
      name: 'documents',
      type: () => DeleteDocumentInputType,
    })
    { IDs }: DeleteDocumentInputType,
    @GetUserGql() user: User,
  ): Promise<string> {
    const deleteResult = await this.documentService.deleteDocuments(IDs, user);
    return JSON.stringify(deleteResult);
  }
}
