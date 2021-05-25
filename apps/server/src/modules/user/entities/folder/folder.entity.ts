import { Field, InputType, ObjectType } from '@nestjs/graphql';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { User } from '../user.entity';
import { FolderSettings } from './folder-settings.entity';

export type FolderConstructorProps = {
  name: string;
  userId: string;
};

@InputType('CreateFolderIt')
@ObjectType()
@Unique(['id'])
@Entity()
export class Folder extends BaseEntity {
  constructor(props: FolderConstructorProps) {
    super();
    Object.assign(this, props);
    if (props) {
      this.settings = new FolderSettings({ icon: undefined });
    }
  }

  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, user => user.id, { onDelete: 'CASCADE' })
  user: User;
  @Field()
  @Column()
  userId: string;

  @Field()
  @Column()
  name: string;

  @Field(() => FolderSettings)
  @Column('json')
  settings: FolderSettings;
}
