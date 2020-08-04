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
    if (props) {
      Object.assign(this, props);
      this.salt = '';
      this.passwordHash = '';
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

  async validatePassword(passwordToValidate: string): Promise<void> {
    const hash = await bcrypt.hash(passwordToValidate, this.salt);
    if (hash !== this.passwordHash)
      throw new UnauthorizedException('invalid password');
  }

  async setPassword(password: string): Promise<void> {
    this.salt = await bcrypt.genSalt();
    this.passwordHash = await bcrypt.hash(password, this.salt);
  }
}

export { User };
