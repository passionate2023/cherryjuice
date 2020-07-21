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
import { ExportsService } from '../exports/exports.service';
import { OwnershipLevel } from './entities/document.owner.entity';
import { Document } from './entities/document.entity';

@UseGuards(GqlAuthGuard)
@Resolver(() => DocumentMutation)
export class DocumentMutationsResolver {
  constructor(
    private nodeService: NodeService,
    private importsService: ImportsService,
    private documentService: DocumentService,
    private exportsService: ExportsService,
  ) {}

  @Mutation(() => DocumentMutation)
  async document(
    @GetUserGql() user: User,
    @Args('file_id', { nullable: true }) file_id?: string,
  ) {
    return { id: file_id };
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
    const document = await this.documentService.createDocument({
      name,
      user,
    });
    return document.id;
  }
  @ResolveField(() => String)
  async editDocument(
    @Args({
      name: 'meta',
      type: () => EditDocumentIt,
    })
    meta: EditDocumentIt,
    @Parent() document: Document,
    @GetUserGql() user: User,
  ): Promise<string> {
    const node = await this.documentService.editDocument({
      meta,
      getDocumentDTO: {
        documentId: document.id,
        userId: user.id,
        ownership: OwnershipLevel.OWNER,
      },
    });
    return node.id;
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
  async exportDocument(
    @Parent() parent,
    @GetUserGql() user: User,
  ): Promise<string> {
    return await this.exportsService.exportDocument({
      userId: user.id,
      documentId: parent.id,
      ownership: OwnershipLevel.OWNER,
    });
  }
  @ResolveField(() => [NodeMutation])
  async node(
    @Parent() { id: documentId },
    @Args('node_id', { type: () => Int }) node_id: number,
  ) {
    return { node_id, documentId };
  }

  @ResolveField(() => Boolean)
  async uploadFromGDrive(
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
}
