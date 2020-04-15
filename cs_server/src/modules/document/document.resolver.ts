import { Args, Int, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { DocumentService } from './document.service';
import { Document } from './document.entity';
import { Node } from './modules/node/entities/node.entity';
import { NodeService } from './modules/node/node.service';

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
      ? [this.documentService.getDocumentMetaById(file_id)]
      : this.documentService.getDocumentsMeta();
  }

  // @ResolveField(() => [Node])
  // async node_meta(): Promise<Node[]> {
  //   return this.documentService.getNodeMeta();
  // }
  //
  // @ResolveField(() => [Node])
  // async node_content(
  //   @Args('node_id', { nullable: false, type: () => Int }) node_id: number,
  // ) {
  //   return [{ node_id }];
  // }
  @ResolveField(() => [Node])
  async node(
    @Args('node_id', { nullable: true, type: () => Int }) node_id?: number,
  ) {
    return node_id
      ? this.nodeService.getNodeMetaById(node_id)
      : this.nodeService.getNodesMeta();
  }
}
