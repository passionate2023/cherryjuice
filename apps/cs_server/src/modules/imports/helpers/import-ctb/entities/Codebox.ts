import { Column, Entity } from 'typeorm';

@Entity('codebox')
export class Codebox {
  @Column('integer', { name: 'node_id', nullable: true })
  nodeId: number | null;

  @Column('integer', { name: 'offset', nullable: true })
  offset: number | null;

  @Column('text', { name: 'justification', nullable: true })
  justification: string | null;

  @Column('text', { name: 'txt', nullable: true })
  txt: string | null;

  @Column('text', { name: 'syntax', nullable: true })
  syntax: string | null;

  @Column('integer', { name: 'width', nullable: true })
  width: number | null;

  @Column('integer', { name: 'height', nullable: true })
  height: number | null;

  @Column('integer', { name: 'is_width_pix', nullable: true })
  isWidthPix: number | null;

  @Column('integer', { name: 'do_highl_bra', nullable: true })
  doHighlBra: number | null;

  @Column('integer', { name: 'do_show_linenum', nullable: true })
  doShowLinenum: number | null;
}
