import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Node } from '../../node/entities/node.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@Entity()
@ObjectType()
export class Image extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(
    () => Node,
    node => node.id,
    { onDelete: 'CASCADE' },
  )
  node: Node;

  @Column()
  nodeId: string;

  @Column({ type: 'bytea', nullable: false })
  thumbnail: Buffer;

  @Column({ type: 'bytea', nullable: false })
  image: Buffer;

  @Field()
  base64: string;

  @Column({ nullable: true })
  hash: string;
}
