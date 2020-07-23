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

export enum OwnershipLevel {
  READER,
  WRITER,
  OWNER,
}
registerEnumType(OwnershipLevel, {
  name: 'OwnershipLevel',
});

@ObjectType()
@InputType('DocumentOwnerIt')
@Unique(['userId', 'documentId'])
@Entity()
export class DocumentOwner extends BaseEntity {
  constructor(user: User, document: Document, ownershipLevel: OwnershipLevel) {
    super();
    this.user = user;
    this.document = document;
    this.ownershipLevel = ownershipLevel;
    this.public = false;
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

  @Field(() => OwnershipLevel)
  @Column({
    type: 'enum',
    enum: OwnershipLevel,
  })
  ownershipLevel: OwnershipLevel;

  @Field()
  @Column('boolean')
  public: boolean;
}
