import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { Node } from '../../node/entities/node.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Document extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @Field()
  id: string;

  @Column('text', { nullable: false })
  @Field()
  name: string;

  @Column('integer', { nullable: false, default: 0 })
  @Field(() => Int)
  size: number;

  @CreateDateColumn({ type: 'timestamp' })
  @Field(() => Float)
  createdAt: number;

  @UpdateDateColumn({ type: 'timestamp' })
  @Field(() => Float)
  updatedAt: number;

  @Field({ nullable: true })
  folder: string;

  @Field(() => [Node], { nullable: 'items' })
  node: Node[];
}
