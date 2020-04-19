import {
  Args,
  Int,
  Mutation,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { DocumentService } from './document.service';
import { Document } from './entities/document.entity';
import { Node } from '../node/entities/node.entity';
import { NodeService } from '../node/node.service';
import { GqlAuthGuard } from '../auth/graphql.guard';
import { UseGuards } from '@nestjs/common';
import { createWriteStream } from 'fs';
import { FileUpload, GraphQLUpload } from './helpers/graphql';

@UseGuards(GqlAuthGuard)
@Resolver(() => Document)
export class DocumentResolver {
  constructor(
    private nodeService: NodeService,
    private documentService: DocumentService,
  ) {}

  @Query(() => [Document], { nullable: 'items' })
  async document(
    @Args('file_id', { nullable: true }) file_id: string | undefined,
  ): Promise<Document[]> {
    if (file_id) await this.documentService.open(file_id);
    return file_id
      ? [await this.documentService.getDocumentMetaById(file_id)]
      : this.documentService.getDocumentsMeta();
  }

  @ResolveField(() => [Node])
  async node(
    @Args('node_id', { nullable: true, type: () => Int }) node_id?: number,
  ) {
    return node_id
      ? this.nodeService.getNodeMetaById(node_id)
      : this.nodeService.getNodesMeta();
  }

  @Mutation(() => Boolean)
  async uploadFile(
    @Args({
      name: 'file',
      type: () => GraphQLUpload(['application/x-sqlite3']),
    })
    { createReadStream, filename }: FileUpload,
  ): Promise<boolean> {
    const filePath = `${process.env.UPLOADS_PATH}${filename}`;
    await new Promise((resolve, reject) =>
      createReadStream()
        .pipe(createWriteStream(filePath))
        .on('finish', () => resolve(true))
        .on('error', () => reject(false)),
    );

    await this.documentService.saveDocument({
      fileName: filename,
      filePath,
    });
    return true;
  }
}
