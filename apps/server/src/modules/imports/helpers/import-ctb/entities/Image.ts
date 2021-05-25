import { Column, Entity } from 'typeorm';

@Entity('image')
export class Image {
  @Column('integer', { name: 'node_id', nullable: true })
  node_id: number | null;

  @Column('integer', { name: 'offset', nullable: true })
  offset: number | null;

  @Column('text', { name: 'justification', nullable: true })
  justification: string | null;

  @Column('text', { name: 'anchor', nullable: true })
  anchor: string | null;

  @Column('blob', { name: 'png', nullable: true })
  png: Buffer | null;

  @Column('text', { name: 'filename', nullable: true })
  filename: string | null;

  @Column('text', { name: 'link', nullable: true })
  link: string | null;

  @Column('integer', { name: 'time', nullable: true })
  time: number | null;
}
