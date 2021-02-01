import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';

export enum Screen {
  Home = 'Home',
  Document = 'Document',
}
registerEnumType(Screen, {
  name: 'Screen',
});

export type ConstructorProps = {
  currentFolderId?: string;
};

@ObjectType()
export class Workspace {
  constructor(props?: ConstructorProps) {
    Object.assign(this, props);
    if (props) {
      this.currentScreen = Screen.Home;
      this.folders = [];
    }
  }

  @Field({ nullable: true })
  currentFolderId: string;

  @Field({ nullable: true })
  currentDocumentId: string;

  @Field(() => Screen)
  currentScreen: Screen;

  @Field(() => [String])
  folders: string[];
}
