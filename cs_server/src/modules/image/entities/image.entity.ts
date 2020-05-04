import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Node } from '../../node/entities/node.entity';

@Entity()
export class Image extends BaseEntity {
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

  @Column('int8')
  offset: number;

  @Column({ type: 'bytea', nullable: false })
  thumbnail: Buffer;

  @Column({ type: 'bytea', nullable: false })
  image: Buffer;
}
