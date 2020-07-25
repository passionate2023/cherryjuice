import {
  Args,
  Int,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { DocumentService } from './document.service';
import { Document, Privacy } from './entities/document.entity';
import { Node } from '../node/entities/node.entity';
import { NodeService } from '../node/node.service';
import { GqlAuthGuard } from '../user/guards/graphql.guard';
import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { GetUserGql } from '../user/decorators/get-user.decorator';
import { User } from '../user/entities/user.entity';
import { AccessLevel } from './entities/document-guest.entity';

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
    if (!file_id && !user) throw new UnauthorizedException();
    return file_id
      ? [
          await this.documentService.getDocumentById({
            userId: user.id,
            documentId: file_id,
            minimumGuestAccessLevel: AccessLevel.READER,
            minimumPrivacy: Privacy.PUBLIC,
          }),
        ]
      : this.documentService.getDocuments({
          userId: user.id,
          documentId: file_id,
          minimumGuestAccessLevel: AccessLevel.READER,
        });
  }

  @ResolveField(() => [Node])
  async node(
    @Parent() document,
    @GetUserGql() user: User,
    @Args('node_id', { nullable: true, type: () => Int }) node_id?: number,
  ) {
    return node_id
      ? [
          await this.nodeService.getNodeById({
            node_id,
            documentId: document.id,
            minimumPrivacy: Privacy.PUBLIC,
            userId: user.id,
          }),
        ]
      : await this.nodeService.getNodes({
          documentId: document.id,
          minimumPrivacy: Privacy.PUBLIC,
          userId: user.id,
        });
  }
}
