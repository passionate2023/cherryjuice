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
import { ExportsService } from '../exports/exports.service';
import { PrivateNode } from '../node/entities/private-node.ot';
import { NotLoggedInException } from '../user/exceptions/not-logged-in.exception';

@UseGuards(GqlAuthGuard)
@Resolver(() => Document)
export class DocumentQueriesResolver {
  constructor(
    private nodeService: NodeService,
    private documentService: DocumentService,
    private exportsService: ExportsService,
  ) {}

  @Query(() => [Document], { nullable: 'items' })
  async document(
    @Args('file_id', { nullable: true, type: () => String })
    file_id: string | undefined,
    @GetUserGql() user: User,
  ): Promise<Document[]> {
    if (!file_id && !user) throw new NotLoggedInException();
    return file_id
      ? [
          await this.documentService.getDocumentById({
            userId: user.id,
            documentId: file_id,
          }),
        ]
      : this.documentService.getDocuments({
          userId: user.id,
        });
  }

  @ResolveField(() => [PrivateNode])
  async privateNodes(
    @Parent() document,
    @GetUserGql() user: User,
  ): Promise<PrivateNode[]> {
    return this.nodeService.getPrivateNodes({
      documentId: document.id,
      userId: user.id,
    });
  }

  @ResolveField(() => [Node])
  async node(
    @Parent() document,
    @GetUserGql() user: User,
    @Args('node_ids', { nullable: 'itemsAndList', type: () => [Int] })
    node_ids?: number[],
  ) {
    return node_ids
      ? await Promise.all(
          node_ids.map(
            async node_id =>
              await this.nodeService.getNodeById({
                node_id,
                documentId: document.id,
                userId: user.id,
              }),
          ),
        )
      : await this.nodeService.getNodes({
          documentId: document.id,
          userId: user.id,
        });
  }
  @ResolveField(() => String)
  async exportDocument(
    @Parent() parent,
    @GetUserGql() user: User,
  ): Promise<string> {
    return await this.exportsService.exportDocument({
      userId: user.id,
      documentId: parent.id,
    });
  }
}
