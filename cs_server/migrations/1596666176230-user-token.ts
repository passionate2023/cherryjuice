import { MigrationInterface, QueryRunner } from 'typeorm';

// eslint-disable-next-line @typescript-eslint/class-name-casing
export class userToken1596666176230 implements MigrationInterface {
  name = 'userToken1596666176230';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "user_token_type_enum" AS ENUM('PASSWORD_RESET', 'EMAIL_VERIFICATION', 'EMAIL_CHANGE')`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_token" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "type" "user_token_type_enum" NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_dddcdb2ee94efe1ad80e95fb37e" UNIQUE ("userId", "type"), CONSTRAINT "PK_48cb6b5c20faa63157b3c1baf7f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_token" ADD CONSTRAINT "FK_d37db50eecdf9b8ce4eedd2f918" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_token" DROP CONSTRAINT "FK_d37db50eecdf9b8ce4eedd2f918"`,
    );
    await queryRunner.query(`DROP TABLE "user_token"`);
    await queryRunner.query(`DROP TYPE "user_token_type_enum"`);
  }
}
