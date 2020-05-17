import { Args, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Injectable, UseGuards } from '@nestjs/common';
import { NodeMutation } from './entities/node-mutation.entity';
import { NodeService } from './node.service';
import { GetUserGql } from '../user/decorators/get-user.decorator';
import { User } from '../user/entities/user.entity';
import { GqlAuthGuard } from '../user/guards/graphql.guard';
import { NodeMetaIt } from './dto/node-meta.it';
import { CreateNodeIt } from './dto/create-node.it';

@UseGuards(GqlAuthGuard)
@Resolver(() => NodeMutation)
@Injectable()
export class NodeMutationsResolver {
  constructor(private nodeService: NodeService) {}

  @ResolveField()
  async saveAHtml(
    @Parent() { node_id, documentId }: { node_id: string; documentId: string },
    @Args('ahtml') ahtml: string,
    @Args({ name: 'deletedImages', type: () => [String], nullable: 'items' })
    deletedImages: string[],
    @GetUserGql() user: User,
  ): Promise<string> {
    await this.nodeService.saveAHtml({
      user,
      node_id,
      ahtml,
      documentId,
      deletedImages,
    });
    return '';
  }
  @ResolveField()
  async meta(
    @Args({ name: 'meta', type: () => NodeMetaIt }) meta: NodeMetaIt,
    @Parent() { node_id, documentId }: { node_id: string; documentId: string },
    @GetUserGql() user: User,
  ): Promise<string> {
    return await this.nodeService.setMeta({ user, node_id, documentId, meta });
  }
  @ResolveField()
  async createNode(
    @Args({ name: 'meta', type: () => CreateNodeIt }) meta: CreateNodeIt,
    @Parent() { node_id, documentId }: { node_id: string; documentId: string },
    @GetUserGql() user: User,
  ): Promise<string> {
    return await this.nodeService.createNode({
      user,
      node_id,
      documentId,
      meta,
    });
  }

  @ResolveField()
  async deleteNode(
    @Parent() { node_id, documentId }: { node_id: string; documentId: string },
    @GetUserGql() user: User,
  ): Promise<string> {
    return await this.nodeService.deleteNode({
      user,
      node_id,
      documentId,
    });
  }
}
