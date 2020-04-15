import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Image {
  @Field(() => Int)
  node_id: number;

  @Field()
  thumbnail: string;

  @Field()
  image: string;
}
