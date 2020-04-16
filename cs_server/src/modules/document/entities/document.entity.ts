import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { Node } from '../../node/entities/node.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Document {
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

  @OneToMany(
    () => Node,
    node => node.document,
    { eager: false },
  )
  @Field(() => [Node], { nullable: 'items' })
  node: Node[];
}
