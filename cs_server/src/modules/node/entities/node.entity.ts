import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
  BeforeUpdate,
  BeforeInsert,
} from 'typeorm';
import { Document } from '../../document/entities/document.entity';
import { Image } from '../../image/entities/image.entity';
import hash from 'object-hash';

@Unique(['node_id', 'documentId'])
@Entity()
@ObjectType()
export class Node extends BaseEntity {
  @ManyToOne(
    () => Document,
    document => document.node,
    { primary: true, onDelete: 'CASCADE' },
  )
  document: Document;
  @Field()
  @Column()
  documentId: string;

  @ManyToOne(
    () => Node,
    node => node.children,
    { nullable: true, onDelete: 'CASCADE' },
  )
  father: Node;
  children: Node[];

  @Column({ nullable: true })
  @Field({ nullable: true })
  fatherId: string;

  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('int2')
  @Field()
  father_id: number;

  @Column()
  @Field(() => Int)
  node_id: number;

  @Column('simple-array')
  @Field(() => [Int])
  child_nodes: number[];

  @Column('text')
  @Field()
  name: string;

  @CreateDateColumn({ type: 'timestamp' })
  @Field(() => Float)
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  @Field(() => Float)
  updatedAt: Date;

  @Column({ nullable: true })
  @Field({ nullable: true })
  node_title_styles: string;

  @Column({ select: false, default: '[]' }) ahtml: string;

  @Column('int2', { default: 0 })
  @Field(() => Int)
  is_empty: number;

  @Column('int8', { default: 1 })
  @Field(() => Int)
  is_richtxt: number;

  @Field(() => [Image], { nullable: 'items' })
  image: Image[];

  @Field()
  html: string;

  @Column('int2', { default: 0 })
  @Field(() => Int)
  read_only: number;

  @Field()
  @Column({ nullable: true })
  hash: string;

  @BeforeUpdate()
  @BeforeInsert()
  updateSha() {
    const fields = [
      this.name,
      this.father_id,
      this.node_id,
      this.child_nodes,
      this.ahtml,
      this.node_title_styles,
      this.read_only,
      this.is_richtxt,
      this.is_empty,
    ];
    this.hash = hash(fields);
  }
}
