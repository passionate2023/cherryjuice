import { Field, ObjectType } from '@nestjs/graphql';
import { NodeMeta } from './node-meta/node-meta.entity';
import { NodeContent } from './node-content/node-content.entity';
import { DocumentMeta } from './document-meta/document-meta.entity';

@ObjectType()
export class Document {
  @Field(() => DocumentMeta)
  document_meta: Promise<DocumentMeta>;

  @Field(() => [NodeMeta])
  node_meta: Promise<NodeMeta[]>;

  @Field(() => [NodeContent])
  node_content: Promise<NodeContent[]>;
}
