import { Column, Entity } from 'typeorm';

@Entity('node')
export class Node {
  @Column('integer', { name: 'node_id', nullable: true, unique: true })
  nodeId: number | null;

  @Column('text', { name: 'name', nullable: true })
  name: string | null;

  @Column('text', { name: 'txt', nullable: true })
  txt: string | null;

  @Column('text', { name: 'syntax', nullable: true })
  syntax: string | null;

  @Column('text', { name: 'tags', nullable: true })
  tags: string | null;

  @Column('integer', { name: 'is_ro', nullable: true })
  isRo: number | null;

  @Column('integer', { name: 'is_richtxt', nullable: true })
  isRichtxt: number | null;

  @Column('integer', { name: 'has_codebox', nullable: true })
  hasCodebox: number | null;

  @Column('integer', { name: 'has_table', nullable: true })
  hasTable: number | null;

  @Column('integer', { name: 'has_image', nullable: true })
  hasImage: number | null;

  @Column('integer', { name: 'level', nullable: true })
  level: number | null;

  @Column('integer', { name: 'ts_creation', nullable: true })
  tsCreation: number | null;

  @Column('integer', { name: 'ts_lastsave', nullable: true })
  tsLastsave: number | null;
}
