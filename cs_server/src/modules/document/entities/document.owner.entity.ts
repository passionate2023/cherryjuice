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

@ObjectType('DocumentOwnerOt')
@InputType('DocumentOwnerIt')
@Unique(['userId', 'documentId'])
@Entity()
export class DocumentOwner extends BaseEntity {
  constructor(
    userId: string,
    documentId: string,
    ownershipLevel: OwnershipLevel,
    isPublic: boolean,
  ) {
    super();
    this.userId = userId;
    this.documentId = documentId;
    this.ownershipLevel = ownershipLevel;
    this.public = isPublic;
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
