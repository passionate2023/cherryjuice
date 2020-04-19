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
} from 'typeorm';
import { Document } from '../../document/entities/document.entity';

@Unique(['node_id', 'documentId'])
@Entity()
@ObjectType()
export class Node extends BaseEntity {
  @ManyToOne(
    () => Document,
    document => document.node,
    { primary: true },
  )
  document: Document;
  @Field()
  @Column()
  documentId: string;

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

  @Column('int2') sequence: number;

  @Column('text')
  @Field()
  name: string;

  @CreateDateColumn({ type: 'timestamp' })
  @Field(() => Float)
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  @Field(() => Float)
  updatedAt: Date;

  @Column()
  @Field()
  node_title_styles: string;

  @Column() ahtml: string;

  @Column('int2')
  @Field(() => Int)
  is_empty: number;

  @Column('int8')
  @Field(() => Int)
  is_richtxt: number;

  @Column('int2')
  @Field(() => Int)
  has_image: number;

  @Column('int2')
  @Field(() => Int)
  has_codebox: number;

  @Column('int2')
  @Field(() => Int)
  has_table: number;

  @Column()
  @Field()
  icon_id: string;

  @Field(() => [String], { nullable: 'items' })
  image: string[];

  @Field()
  html: string;
}
