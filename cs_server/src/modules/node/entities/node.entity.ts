import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Document } from '../../document/entities/document.entity';
import { Image } from '../../image/entities/image.entity';

@Entity()
@ObjectType()
export class Node {
  @PrimaryGeneratedColumn('increment')
  @Field(() => Int)
  node_id: number;

  @Column('text')
  @Field()
  name: string;

  @Column('int2')
  @Field(() => Int)
  father_id: number;

  @OneToMany(
    () => Node,
    node => node.node_id,
  )
  @Field(() => [Int])
  child_nodes: number[];

  @Column('int2')
  @Field(() => Int)
  is_empty: number;

  @Column('int2')
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

  @CreateDateColumn({ type: 'timestamp' })
  @Field(() => Float)
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  @Field(() => Float)
  updatedAt: Date;

  @Column()
  @Field()
  node_title_styles: string;

  @Column()
  @Field()
  icon_id: string;

  @Column()
  ahtml: string;

  @Field()
  html: string;

  @OneToMany(
    () => Image,
    image => image.node_id,
  )
  @Field(() => [String], { nullable: 'items' })
  image: string[];

  @ManyToOne(
    () => Document,
    document => document.node,
  )
  document: string;

  @Column('int2')
  sequence: number;
}
