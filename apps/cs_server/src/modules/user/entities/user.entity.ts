import {
  BaseEntity,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import * as bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';
import { UnauthorizedException } from '@nestjs/common';
import { AfterLoad } from 'typeorm/index';
import { UserToken } from './user-token.entity';
import { Settings } from './settings/settings.entity';
import { getDefaultSettings } from '@cherryjuice/default-settings';

type UserConstructorProps = {
  username: string;
  email: string;
  lastName: string;
  firstName: string;
  thirdPartyId?: string;
};

@ObjectType()
@Unique(['username'])
@Unique(['email'])
@Entity()
class User extends BaseEntity {
  constructor(props: Partial<User> & UserConstructorProps) {
    super();
    Object.assign(this, props);
    if (props) {
      this.salt = '';
      this.passwordHash = '';
      this.settings = getDefaultSettings();
    }
  }

  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  username: string;

  @Field()
  @Column()
  email: string;

  @Field()
  @Column()
  lastName: string;

  @Field()
  @Column()
  firstName: string;

  @Exclude()
  @Column({ name: 'password' })
  private passwordHash: string;

  @Exclude()
  @Column()
  private salt: string;

  @Exclude()
  @Column({ nullable: true })
  private thirdPartyId: string;

  @Exclude()
  @Column({ nullable: true })
  thirdParty: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  picture: string;

  @Field(() => Boolean)
  @Column({ default: false })
  email_verified: boolean;

  @Field(() => Boolean)
  hasPassword = false;

  @Field(() => [UserToken], { nullable: 'items' })
  tokens: UserToken[];

  async validatePassword(passwordToValidate: string): Promise<void> {
    const hash = await bcrypt.hash(passwordToValidate, this.salt);
    if (hash !== this.passwordHash)
      throw new UnauthorizedException('invalid password');
  }

  async setPassword(password: string): Promise<void> {
    this.salt = await bcrypt.genSalt();
    this.passwordHash = await bcrypt.hash(password, this.salt);
    this.hasPassword = Boolean(this.passwordHash);
  }

  @AfterLoad()
  setHashPassword() {
    this.hasPassword = Boolean(this.passwordHash);
  }

  @Column('json')
  settings: Settings;
}

export { User };
