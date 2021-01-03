import {
  BaseEntity,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Unique,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm/index';
import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { User } from './user.entity';

export enum UserTokenType {
  'PASSWORD_RESET' = 'PASSWORD_RESET',
  'EMAIL_VERIFICATION' = 'EMAIL_VERIFICATION',
  'EMAIL_CHANGE' = 'EMAIL_CHANGE',
}
registerEnumType(UserTokenType, {
  name: 'UserTokenType',
});

@ObjectType()
export class UserTokenMeta {
  constructor({
    emailChange,
  }: {
    emailChange?: { newEmail: string; currentEmail: string };
  }) {
    if (emailChange) {
      this.newEmail = emailChange.newEmail;
      this.currentEmail = emailChange.currentEmail;
    }
  }

  @Field({ nullable: true })
  newEmail?: string;
  @Field({ nullable: true })
  currentEmail?: string;
}

type ConstructorProps = {
  userId: string;
  type: UserTokenType;
  meta?: UserTokenMeta;
};

@ObjectType()
@Unique(['userId', 'type'])
@Entity()
export class UserToken extends BaseEntity {
  constructor(props: ConstructorProps) {
    super();
    if (props) {
      this.userId = props.userId;
      this.type = props.type;
      if (props.meta) this.meta = props.meta;
    }
  }

  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, user => user.id, { onDelete: 'CASCADE' })
  user: User;
  @Column()
  userId: string;

  @Column({
    type: 'enum',
    enum: UserTokenType,
  })
  @Field(() => UserTokenType)
  type: UserTokenType;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  private createdAt: number;

  @Field(() => UserTokenMeta, { nullable: true })
  @Column('json', { nullable: true })
  meta: UserTokenMeta;
}
