import {
  BaseEntity,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import * as bcrypt from 'bcrypt';

@ObjectType()
@Unique(['username'])
@Unique(['email'])
@Entity()
class User extends BaseEntity {
  constructor(
    username: string,
    email: string,
    lastName: string,
    firstName: string,
  ) {
    super();
    this.username = username;
    this.email = email;
    this.lastName = lastName;
    this.firstName = firstName;
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

  @Column()
  password: string;

  @Column()
  salt: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  thirdPartyId: string;

  @Column({ nullable: true })
  thirdParty: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  picture: string;

  @Field(() => Boolean)
  @Column({ default: false })
  email_verified: boolean;

  async validatePassword(password: string): Promise<boolean> {
    const hash = await this.hashPassword(password, this.salt);
    return hash === this.password;
  }

  async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}

export { User };
