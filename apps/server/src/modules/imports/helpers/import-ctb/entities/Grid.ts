import { Column, Entity } from 'typeorm';

@Entity('grid')
export class Grid {
  @Column('integer', { name: 'node_id', nullable: true })
  nodeId: number | null;

  @Column('integer', { name: 'offset', nullable: true })
  offset: number | null;

  @Column('text', { name: 'justification', nullable: true })
  justification: string | null;

  @Column('text', { name: 'txt', nullable: true })
  txt: string | null;

  @Column('integer', { name: 'col_min', nullable: true })
  colMin: number | null;

  @Column('integer', { name: 'col_max', nullable: true })
  colMax: number | null;
}
