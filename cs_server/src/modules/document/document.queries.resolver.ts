import {
  Args,
  Int,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { DocumentService } from './document.service';
import { Document } from './entities/document.entity';
import { Node } from '../node/entities/node.entity';
import { NodeService } from '../node/node.service';
import { GqlAuthGuard } from '../user/guards/graphql.guard';
import { UseGuards } from '@nestjs/common';
import { GetUserGql } from '../user/decorators/get-user.decorator';
import { User } from '../user/entities/user.entity';
import { debug } from '../shared';

@UseGuards(GqlAuthGuard)
@Resolver(() => Document)
export class DocumentQueriesResolver {
  constructor(
    private nodeService: NodeService,
    private documentService: DocumentService,
  ) {}

  @Query(() => [Document], { nullable: 'items' })
  async document(
    @Args('file_id', { nullable: true }) file_id: string | undefined,
    @GetUserGql() user: User,
  ): Promise<Document[]> {
    if (debug.loadSqliteDocuments) {
      if (file_id) await this.documentService.openLocalSqliteFile(file_id);
    }
    return file_id
      ? [await this.documentService.getDocumentMetaById(user, file_id)]
      : this.documentService.getDocumentsMeta(user);
  }

  @ResolveField(() => [Node])
  async node(
    @Parent() document,
    @GetUserGql() user: User,
    @Args('node_id', { nullable: true, type: () => Int }) node_id?: number,
  ) {
    return node_id
      ? [
          await this.nodeService.getNodeMetaById({
            user,
            node_id,
            documentId: document.id,
          }),
        ]
      : this.nodeService.getNodesMeta(document.id);
  }
}
