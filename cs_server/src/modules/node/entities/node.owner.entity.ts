import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Node } from './node.entity';
import { OwnershipLevel } from '../../document/entities/document.owner.entity';
import { User } from '../../user/entities/user.entity';
import { Document } from '../../document/entities/document.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Unique(['nodeId', 'documentId'])
@Unique(['node_id', 'documentId'])
@Entity()
export class NodeOwner extends BaseEntity {
  /// - inherited from DocumentOwner
  // had to paste code instead of direct inheritence because inheritance brought unique constraints
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

  @Field()
  @Column({
    type: 'enum',
    enum: OwnershipLevel,
  })
  ownershipLevel: OwnershipLevel;

  @Field()
  @Column('boolean')
  public: boolean;
  /// - unique to NodeOwner

  @ManyToOne(
    () => Node,
    node => node.id,
    { onDelete: 'CASCADE' },
  )
  node: Node;
  @Column()
  nodeId: string;

  @Column('int')
  node_id: number;
}
