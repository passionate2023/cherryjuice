import { Args, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Injectable, UseGuards } from '@nestjs/common';
import { NodeMutation } from './entities/node-mutation.entity';
import { NodeService } from './node.service';
import { GetUserGql } from '../user/decorators/get-user.decorator';
import { User } from '../user/entities/user.entity';
import { GqlAuthGuard } from '../user/guards/graphql.guard';
import { NodeMetaIt } from './dto/node-meta.it';
import { CreateNodeIt } from './dto/create-node.it';
import { ImportsService } from '../imports/imports.service';
import { FileUpload, GraphQLUpload } from '../document/helpers/graphql';
import { SaveHtmlIt } from './dto/save-html.it';

@UseGuards(GqlAuthGuard)
@Resolver(() => NodeMutation)
@Injectable()
export class NodeMutationsResolver {
  constructor(
    private nodeService: NodeService,
    private importsService: ImportsService,
  ) {}

  @ResolveField()
  async saveAHtml(
    @Parent() { node_id, documentId }: { node_id: number; documentId: string },
    @Args({ name: 'data', type: () => SaveHtmlIt }) data: SaveHtmlIt,
    deletedImages: string[],
    @GetUserGql() user: User,
  ): Promise<string> {
    await this.nodeService.saveAHtml({
      user,
      node_id,
      data,
      documentId,
    });
    return '';
  }

  @ResolveField()
  async meta(
    @Args({ name: 'meta', type: () => NodeMetaIt }) meta: NodeMetaIt,
    @Parent() { node_id, documentId }: { node_id: number; documentId: string },
    @GetUserGql() user: User,
  ): Promise<string> {
    return await this.nodeService.setMeta({ user, node_id, documentId, meta });
  }

  @ResolveField()
  async createNode(
    @Args({ name: 'meta', type: () => CreateNodeIt }) meta: CreateNodeIt,
    @Parent() { node_id, documentId }: { node_id: number; documentId: string },
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
    @Parent() { node_id, documentId }: { node_id: number; documentId: string },
  ): Promise<string> {
    return await this.nodeService.deleteNode({
      node_id,
      documentId,
    });
  }

  @ResolveField(() => [[String]])
  async uploadImage(
    @Args({
      name: 'images',
      type: () => [GraphQLUpload(['image/png'], 'ImageUpload')],
    })
    images: FileUpload[],
    @Parent() { node_id, documentId }: { node_id: number; documentId: string },
    @GetUserGql() user: User,
  ): Promise<[string, string][]> {
    return await this.importsService.importImages({
      images,
      documentId,
      node_id,
      user,
    });
  }
}
