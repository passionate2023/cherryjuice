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

type ConstructorProps = {
  userId: string;
  type: UserTokenType;
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
    }
  }

  @PrimaryGeneratedColumn('uuid')
  @Field()
  id: string;

  @ManyToOne(
    () => User,
    user => user.id,
    { onDelete: 'CASCADE' },
  )
  user: User;
  @Column()
  @Field()
  userId: string;

  @Column({
    type: 'enum',
    enum: UserTokenType,
  })
  @Field(() => UserTokenType)
  type: UserTokenType;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  private createdAt: number;
}