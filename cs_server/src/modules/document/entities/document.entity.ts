import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { Node } from '../../node/entities/node.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
@Entity()
@ObjectType()
export class Document extends BaseEntity {
  constructor(user: User, name: string, size: number, id: string) {
    super();
    this.id = id;
    this.name = name;
    this.user = user;
    this.size = size;
  }
  @PrimaryColumn()
  @Field()
  id: string;

  @ManyToOne(
    () => User,
    user => user.id,
    { onDelete: 'CASCADE' },
  )
  user: User;
  @Column()
  userId: string;

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

  @Column({ nullable: true })
  @Field({ nullable: true })
  status: string;
}
