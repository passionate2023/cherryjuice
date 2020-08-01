import { MigrationInterface, QueryRunner } from 'typeorm';
// eslint-disable-next-line @typescript-eslint/class-name-casing
export class nodePrivacy1595879906922 implements MigrationInterface {
  name = 'nodePrivacy1595879906922';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "node_privacy_enum" AS ENUM('1', '2', '3', '4')`,
    );
    await queryRunner.query(
      `ALTER TABLE "node" ALTER COLUMN "privacy" TYPE "node_privacy_enum" USING "privacy"::"text"::"node_privacy_enum"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "node" ALTER COLUMN "privacy" TYPE "document_privacy_enum" USING "privacy"::"text"::"document_privacy_enum"`,
    );
    await queryRunner.query(`DROP TYPE "node_privacy_enum"`);
  }
}
