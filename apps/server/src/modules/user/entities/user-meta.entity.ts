import { ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserMeta {
  // @Field(() => Workspace)
  // workspace: Workspace;
  //
  // @Field(() => [Folder])
  // folders: Folder[];
}
