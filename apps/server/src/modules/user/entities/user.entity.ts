import {
  BaseEntity,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import * as bcrypt from 'bcrypt';
import { AfterLoad } from 'typeorm';
import { UserToken } from './user-token.entity';
import { Settings } from './settings/settings.entity';
import { getDefaultSettings } from '@cherryjuice/default-settings';
import { Workspace } from './workspace/workspace.entity';
import { InvalidPasswordException } from '../exceptions/invalid-password.exception';

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
      this.workspace = new Workspace({});
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

  @Column({ name: 'password' })
  private passwordHash: string;

  @Column()
  private salt: string;

  @Column({ nullable: true })
  private thirdPartyId: string;

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
    if (hash !== this.passwordHash) throw new InvalidPasswordException();
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

  @Column('json')
  workspace: Workspace;
}

export { User };
