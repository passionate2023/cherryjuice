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

export enum OwnershipLevel {
  READER,
  WRITER,
  OWNER,
}

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

  @Column({
    type: 'enum',
    enum: OwnershipLevel,
  })
  ownershipLevel: OwnershipLevel;

  @Column('boolean')
  public: boolean;
}
