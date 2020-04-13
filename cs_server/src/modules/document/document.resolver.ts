import {
  Args,
  Int,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { DocumentService } from './document.service';
import { Document } from './document.entity';
import { NodeMeta } from './node-meta/node-meta.entity';
import { NodeContentService } from './node-content/node-content.service';
import { NodeContent } from './node-content/node-content.entity';
import { DocumentMeta } from './document-meta/document-meta.entity';

@Resolver(() => Document)
export class DocumentResolver {
  constructor(
    private nodeContentService: NodeContentService,
    private documentService: DocumentService,
  ) {}

  @Query(() => [Document])
  async document(
    @Args('file_id', { nullable: true }) file_id: string | undefined,
  ): Promise<[{ file_id: string }] | DocumentMeta[]> {
    if (file_id) await this.documentService.open(file_id);
    return file_id ? [{ file_id }] : this.documentService.getDocumentsMeta();
  }

  @ResolveField(() => DocumentMeta)
  document_meta(@Parent() parent): DocumentMeta {
    return this.documentService.getDocumentMetaById(
      parent.file_id || parent.id,
    );
  }

  @ResolveField(() => [NodeMeta])
  async node_meta(): Promise<NodeMeta[]> {
    return this.documentService.getNodeMeta();
  }

  @ResolveField(() => [NodeContent])
  async node_content(
    @Args('node_id', { nullable: false, type: () => Int }) node_id: number,
  ) {
    return this.nodeContentService.getNode(String(node_id));
  }
}
