import { Field, ObjectType } from '@nestjs/graphql';
import { NodeMeta } from './modules/node-meta/node-meta.entity';
import { NodeContent } from './modules/node-content/node-content.entity';
import { DocumentMeta } from './modules/document-meta/document-meta.entity';

@ObjectType()
export class Document {
  @Field(() => DocumentMeta)
  document_meta: Promise<DocumentMeta>;

  @Field(() => [NodeMeta])
  node_meta: Promise<NodeMeta[]>;

  @Field(() => [NodeContent])
  node_content: Promise<NodeContent[]>;
}
