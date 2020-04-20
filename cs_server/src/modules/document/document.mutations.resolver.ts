import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/graphql.guard';
import { Args, Mutation, ResolveField, Resolver } from '@nestjs/graphql';
import { NodeService } from '../node/node.service';
import { DocumentService } from './document.service';
import { FileUpload, GraphQLUpload } from './helpers/graphql';
import { GetUserGql } from '../auth/decorators/get-user.decorator';
import { User } from '../auth/entities/user.entity';
import { createWriteStream } from 'fs';
import { DocumentUpload } from './entities/document-upload.entity';

@UseGuards(GqlAuthGuard)
@Resolver(() => DocumentUpload)
export class DocumentMutationsResolver {
  constructor(
    private nodeService: NodeService,
    private documentService: DocumentService,
  ) {}

  @Mutation(() => DocumentUpload)
  document(): {} {
    return {};
  }

  @ResolveField(() => Boolean)
  upload(
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
}
