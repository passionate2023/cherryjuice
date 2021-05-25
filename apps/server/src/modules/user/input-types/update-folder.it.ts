import { Field, InputType } from '@nestjs/graphql';
import { FolderSettings } from '../entities/folder/folder-settings.entity';

export type FolderConstructorProps = {
  name: string;
  userId: string;
};

@InputType()
export class UpdateFolderIt {
  @Field()
  id: string;

  @Field({ nullable: true })
  name: string;

  @Field(() => FolderSettings, { nullable: true })
  settings: FolderSettings;
}
