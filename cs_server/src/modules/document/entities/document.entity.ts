import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { Node } from '../../node/entities/node.entity';
import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { randomUUID10 } from '../../shared';
import hash from 'object-hash';

export type NodesHash = { [node_id: number]: { hash: string } };

@Entity()
@ObjectType()
export class Document extends BaseEntity {
  constructor(name: string, size = 0) {
    super();
    this.id = randomUUID10();
    this.name = name;
    this.size = size;
    this.hash = '';
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

  @Field({ nullable: true })
  folder: string;

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
}
