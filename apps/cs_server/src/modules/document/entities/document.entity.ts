import {
  Field,
  Float,
  Int,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { Node } from '../../node/entities/node.entity';
import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { randomUUID10 } from '../../shared';
import hash from 'object-hash';
import { DocumentGuest } from './document-guest.entity';
import { User } from '../../user/entities/user.entity';
import { DocumentState } from './document-state.entity';
import { Folder } from '../../user/entities/folder/folder.entity';

export type NodesHash = { [node_id: number]: { hash: string } };
export enum Privacy {
  PRIVATE = 1,
  GUESTS_ONLY,
  PUBLIC,
}
registerEnumType(Privacy, {
  name: 'Privacy',
});
type DocumentConstructorProps = {
  userId: string;
  name: string;
  size?: number;
  privacy: Privacy;
  folderId: string;
};

@Entity()
@ObjectType()
export class Document extends BaseEntity {
  constructor(args: DocumentConstructorProps) {
    super();
    if (args?.userId) {
      const { name, size, userId, privacy, folderId } = args;
      this.id = randomUUID10();
      this.name = name;
      this.size = size || 0;
      this.userId = userId;
      this.privacy = privacy;
      this.folderId = folderId;
      this.hash = '';
      this.state = new DocumentState(true);
    }
  }
  @PrimaryColumn()
  @Field()
  id: string;

  @Column('text', { nullable: false })
  @Field()
  name: string;

  @Column('integer', { nullable: false, default: 0 })
  @Field(() => Int)
  size: number;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  @Field(() => Float)
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  @Field(() => Float)
  updatedAt: Date;

  @Field(() => [Node], { nullable: 'items' })
  node: Node[];

  @Column({ nullable: true })
  @Field({ nullable: true })
  status: string;

  @Column('json', { nullable: true, default: {}, select: false })
  nodes: NodesHash;

  @Column({ nullable: true })
  @Field({ nullable: true })
  hash: string;

  @BeforeUpdate()
  @BeforeInsert()
  updateHash() {
    const fields = [this.name, this.nodes];
    this.hash = hash(fields);
  }

  @ManyToOne(() => User, user => user.id, { onDelete: 'CASCADE' })
  user: User;
  @Field()
  @Column()
  userId: string;

  @ManyToOne(() => Folder, folder => folder.id)
  folder: Folder;
  @Field({ nullable: true })
  @Column({ nullable: true })
  folderId: string;

  @Field(() => Privacy)
  @Column({
    type: 'enum',
    enum: Privacy,
  })
  privacy: Privacy;

  @Field(() => [DocumentGuest], { nullable: 'itemsAndList' })
  guests: DocumentGuest[];

  @Column({ type: 'json' })
  @Field(() => DocumentState)
  state: DocumentState;
}
