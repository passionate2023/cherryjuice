import { Field, Float, ObjectType, registerEnumType } from '@nestjs/graphql';

export enum OPERATION_STATE {
  PENDING = 'PENDING',
  PREPARING = 'PREPARING',
  STARTED = 'STARTED',
  FINISHED = 'FINISHED',
  FAILED = 'FAILED',
  DUPLICATE = 'DUPLICATE',
}
registerEnumType(OPERATION_STATE, {
  name: 'OPERATION_STATE',
});

export enum OPERATION_CONTEXT {
  NODES = 'NODES',
  IMAGES = 'IMAGES',
}

registerEnumType(OPERATION_CONTEXT, {
  name: 'OPERATION_CONTEXT',
});

export enum OPERATION_TYPE {
  IMPORT = 'IMPORT',
  EXPORT = 'EXPORT',
  CACHE = 'CACHE',
  CLONE = 'CLONE',
  DELETE = 'DELETE',
}
registerEnumType(OPERATION_TYPE, {
  name: 'OPERATION_TYPE',
});

@ObjectType()
export class DocumentTarget {
  @Field(() => String, { nullable: true })
  hash: string;

  @Field(() => String)
  id: string;

  @Field(() => String, { nullable: true })
  name: string;
}

@ObjectType()
export class DocumentOperation {
  @Field()
  userId: string;

  @Field(() => OPERATION_STATE)
  state: OPERATION_STATE;

  @Field(() => OPERATION_TYPE)
  type: OPERATION_TYPE;

  @Field(() => OPERATION_CONTEXT, { nullable: true })
  context?: OPERATION_CONTEXT;

  @Field(() => Float, { nullable: true })
  progress?: number;

  // todo: use a union type
  @Field(() => DocumentTarget)
  target: DocumentTarget;
}
