import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
  BeforeUpdate,
  BeforeInsert,
} from 'typeorm';
import { Document, Privacy } from '../../document/entities/document.entity';
import { Image } from '../../image/entities/image.entity';
import hash from 'object-hash';

@Unique(['node_id', 'documentId'])
@Entity()
@ObjectType()
export class Node extends BaseEntity {
  @ManyToOne(
    () => Document,
    document => document.node,
    { primary: true, onDelete: 'CASCADE' },
  )
  document: Document;
  @Field()
  @Column()
  documentId: string;

  @ManyToOne(
    () => Node,
    node => node.children,
    { nullable: true, onDelete: 'CASCADE' },
  )
  father: Node;
  children: Node[];

  @Column({ nullable: true })
  @Field({ nullable: true })
  fatherId: string;

  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('int2')
  @Field()
  father_id: number;

  @Column()
  @Field(() => Int)
  node_id: number;

  @Column('simple-array')
  @Field(() => [Int])
  child_nodes: number[];

  @Column('text')
  @Field()
  name: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  @Field(() => Float)
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  @Field(() => Float)
  updatedAt: Date;

  @Column({ nullable: true })
  @Field({ nullable: true, defaultValue: '{}' })
  node_title_styles: string;

  @Column({ select: false, default: '[]' })
  ahtml: string;

  @Field(() => [Image], { nullable: 'items' })
  image: Image[];

  @Field()
  html: string;

  @Column('int2', { default: 0 })
  @Field(() => Int)
  read_only: number;

  @Field()
  @Column({ nullable: true })
  hash: string;

  @Column({ select: false, default: '' })
  ahtml_txt: string;

  updateAhtmlTxt(): void {
    if (this.ahtml)
      this.ahtml_txt = JSON.parse(this.ahtml).reduce((acc, val) => {
        acc += `${val[0]
          .flatMap(element =>
            typeof element === 'string' ? element : element._ || '',
          )
          .join(' ')}\n`;
        return acc;
      }, '');
  }

  @Column('tsvector')
  ahtml_tsv: string;

  @Column('tsvector')
  name_tsv: string;

  @BeforeUpdate()
  @BeforeInsert()
  updateSha() {
    const fields = [
      this.name,
      this.father_id,
      this.node_id,
      this.child_nodes,
      this.ahtml,
      this.node_title_styles,
      this.read_only,
    ];
    this.hash = hash(fields);
  }

  @Field(() => Privacy, { nullable: true })
  @Column({
    type: 'enum',
    enum: Privacy,
    nullable: true,
  })
  privacy?: Privacy;
}
