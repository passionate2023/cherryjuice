import { Args, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Injectable, UseGuards } from '@nestjs/common';
import { NodeMutation } from './entities/node-mutation.entity';
import { NodeService } from './node.service';
import { GetUserGql } from '../user/decorators/get-user.decorator';
import { User } from '../user/entities/user.entity';
import { GqlAuthGuard } from '../user/guards/graphql.guard';
import { NodeMetaIt } from './it/node-meta.it';
import { CreateNodeIt } from './it/create-node.it';
import { ImportsService } from '../imports/imports.service';
import { FileUpload, GraphQLUpload } from '../document/helpers/graphql';
import { SaveHtmlIt } from './it/save-html.it';
import { Node } from './entities/node.entity';

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
    @Parent() node: Node,
    @Args({ name: 'data', type: () => SaveHtmlIt }) data: SaveHtmlIt,
    deletedImages: string[],
    @GetUserGql() user: User,
  ): Promise<string> {
    await this.nodeService.setAHtml({
      data,
      getNodeDTO: {
        userId: user.id,
        node_id: node.node_id,
        documentId: node.documentId,
      },
    });
    return '';
  }

  @ResolveField()
  async editMeta(
    @Parent() node: Node,
    @Args({ name: 'meta', type: () => [NodeMetaIt] }) nodeMetaIts: NodeMetaIt[],
    @GetUserGql() user: User,
  ): Promise<string[]> {
    const editedNodesIds: string[] = [];
    for await (const data of nodeMetaIts) {
      const id = await this.nodeService.editMeta({
        data,
        getNodeDTO: {
          node_id: data.node_id,
          documentId: node.documentId,
          userId: user.id,
        },
      });
      editedNodesIds.push(id);
    }
    return editedNodesIds;
  }
  @ResolveField()
  async createNode(
    @Args({ name: 'meta', type: () => CreateNodeIt }) data: CreateNodeIt,
    @Parent() node: Node,
    @GetUserGql() user: User,
  ): Promise<string> {
    const createdNode = await this.nodeService.createNode({
      getNodeDTO: {
        documentId: node.documentId,
        node_id: node.node_id,
        userId: user.id,
      },
      data,
    });
    return createdNode.id;
  }

  @ResolveField()
  async deleteNode(
    @Parent() node: Node,
    @GetUserGql() user: User,
  ): Promise<string> {
    return await this.nodeService.deleteNode({
      getNodeDTO: {
        node_id: node.node_id,
        documentId: node.documentId,
        userId: user.id,
      },
    });
  }
  @ResolveField(() => [[String]])
  async uploadImage(
    @Args({
      name: 'images',
      type: () => [GraphQLUpload(['image/png'], 'ImageUpload')],
    })
    images: FileUpload[],
    @Parent() node: Node,
    @GetUserGql() user: User,
  ): Promise<[string, string][]> {
    return await this.importsService.importImages({
      images,
      getNodeDTO: {
        node_id: node.node_id,
        documentId: node.documentId,
        userId: user.id,
      },
    });
  }
}
