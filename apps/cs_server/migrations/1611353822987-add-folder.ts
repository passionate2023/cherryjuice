import { MigrationInterface, QueryRunner } from 'typeorm';

export class addFolder1611353822987 implements MigrationInterface {
  name = 'addFolder1611353822987';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "folder" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "name" character varying NOT NULL, "settings" json NOT NULL, CONSTRAINT "UQ_6278a41a706740c94c02e288df8" UNIQUE ("id"), CONSTRAINT "PK_6278a41a706740c94c02e288df8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "user" ADD "workspace" json NOT NULL`);
    await queryRunner.query(`ALTER TABLE "document" ADD "folderId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "folder" ADD CONSTRAINT "FK_a0ef64d088bc677d66b9231e90b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "document" ADD CONSTRAINT "FK_76b187510eda9c862f9944808a8" FOREIGN KEY ("folderId") REFERENCES "folder"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "document" DROP CONSTRAINT "FK_76b187510eda9c862f9944808a8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "folder" DROP CONSTRAINT "FK_a0ef64d088bc677d66b9231e90b"`,
    );
    await queryRunner.query(`ALTER TABLE "document" DROP COLUMN "folderId"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "workspace"`);
    await queryRunner.query(`DROP TABLE "folder"`);
  }
}
