import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';

export enum SortDocumentsBy {
  CreatedAt = 'CreatedAt',
  UpdatedAt = 'UpdatedAt',
  DocumentName = 'DocumentName',
  Size = 'Size',
}
registerEnumType(SortDocumentsBy, {
  name: 'SortDocumentsBy',
});

export type ConstructorProps = {
  icon?: string;
};

@InputType('FolderSettingsIt')
@ObjectType()
export class FolderSettings {
  constructor(props: ConstructorProps) {
    Object.assign(this, props);
    if (props) {
      this.sortDocumentsBy = SortDocumentsBy.DocumentName;
    }
  }

  @Field(() => SortDocumentsBy)
  sortDocumentsBy: SortDocumentsBy;

  @Field({ nullable: true })
  icon: string;
}
