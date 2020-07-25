import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Document } from './document.entity';
import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';

export enum AccessLevel {
  READER = 1,
  WRITER,
}
registerEnumType(AccessLevel, {
  name: 'AccessLevel',
});

@ObjectType('DocumentGuestOt')
@InputType('DocumentGuestIt')
@Unique(['userId', 'documentId'])
@Entity()
export class DocumentGuest extends BaseEntity {
  constructor(userId: string, documentId: string, accessLevel: AccessLevel) {
    super();
    this.userId = userId;
    this.documentId = documentId;
    this.accessLevel = accessLevel;
  }
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(
    () => User,
    user => user.id,
    { onDelete: 'CASCADE' },
  )
  user: User;
  @Field()
  @Column()
  userId: string;

  @ManyToOne(
    () => Document,
    document => document.id,
    { onDelete: 'CASCADE' },
  )
  document: Document;
  @Column()
  documentId: string;

  @Field(() => AccessLevel)
  @Column({
    type: 'enum',
    enum: AccessLevel,
  })
  accessLevel: AccessLevel;
}
