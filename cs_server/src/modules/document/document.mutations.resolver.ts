import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../user/guards/graphql.guard';
import {
  Args,
  Int,
  Mutation,
  Parent,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { NodeService } from '../node/node.service';
import { DocumentService } from './document.service';
import { FileUpload, GraphQLUpload } from './helpers/graphql';
import { GetUserGql } from '../user/decorators/get-user.decorator';
import { User } from '../user/entities/user.entity';
import { DocumentMutation } from './entities/document-mutation.entity';
import { UploadLinkInputType } from './input-types/upload-link.input-type';
import { DeleteDocumentInputType } from './input-types/delete-document.input-type';
import { ImportsService } from '../imports/imports.service';
import { NodeMutation } from '../node/entities/node-mutation.entity';
import { CreateDocumentIt } from './input-types/create-document.it';
import { EditDocumentIt } from './input-types/edit-document.it';

@UseGuards(GqlAuthGuard)
@Resolver(() => DocumentMutation)
export class DocumentMutationsResolver {
  constructor(
    private nodeService: NodeService,
    private importsService: ImportsService,
    private documentService: DocumentService,
  ) {}

  @Mutation(() => DocumentMutation)
  document(@Args('file_id', { nullable: true }) file_id?: string): {} {
    return { id: file_id };
  }

  @ResolveField(() => Boolean)
  async uploadFile(
    @Args({
      name: 'files',
      type: () => [GraphQLUpload(['application/x-sqlite3'], 'CTBUpload')],
    })
    files: FileUpload[],
    @GetUserGql() user: User,
  ): Promise<boolean> {
    await this.importsService.importFromGraphqlClient(files, user);
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
    this.importsService.importDocumentsFromGDrive(IDs, user, access_token);
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

  @ResolveField(() => String)
  async createDocument(
    @Args({
      name: 'document',
      type: () => CreateDocumentIt,
    })
    { name }: CreateDocumentIt,
    @GetUserGql() user: User,
  ): Promise<string> {
    const createResult = await this.documentService.createDocument({
      name,
      size: 0,
      user,
    });
    return createResult.id;
  }
  @ResolveField(() => String)
  async editDocument(
    @Args({
      name: 'meta',
      type: () => EditDocumentIt,
    })
    meta: EditDocumentIt,
    @Parent() parent,
    @GetUserGql() user: User,
  ): Promise<string> {
    const res = await this.documentService.editDocument({
      meta,
      user,
      documentId: parent.id,
    });
    return res;
  }
  @ResolveField(() => [NodeMutation])
  async node(
    @Parent() parent,
    @Args('node_id', { type: () => Int }) node_id: number,
    @GetUserGql() user: User,
  ) {
    await this.documentService.getDocumentMetaById(user, parent.id);
    return { node_id, documentId: parent.id };
  }
}
