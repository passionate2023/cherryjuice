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
import { GqlAuthGuard } from '../auth/graphql.guard';
import { UseGuards } from '@nestjs/common';
import { GetUserGql } from '../auth/decorators/get-user.decorator';
import { User } from '../auth/entities/user.entity';
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
    @Parent() parent,
    @Args('node_id', { nullable: true, type: () => Int }) node_id?: string,
  ) {
    return node_id
      ? this.nodeService.getNodeMetaById(node_id, parent.id)
      : this.nodeService.getNodesMeta(parent.id);
  }
}
