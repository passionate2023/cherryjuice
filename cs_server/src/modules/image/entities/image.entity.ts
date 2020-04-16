import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Node } from '../../node/entities/node.entity';

@Entity()
export class Image {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(
    () => Node,
    node => node.image,
  )
  node_id: number;

  @Column({ type: 'bytea', nullable: false })
  thumbnail: string;

  @Column({ type: 'bytea', nullable: false })
  image: string;
}
