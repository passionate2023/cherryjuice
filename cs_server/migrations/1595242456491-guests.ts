import { MigrationInterface, QueryRunner } from 'typeorm';

// eslint-disable-next-line @typescript-eslint/class-name-casing
export class guests1595242456491 implements MigrationInterface {
  name = 'guests1595242456491';
  public async up(queryRunner: QueryRunner): Promise<void> {
    // types
    await queryRunner.query(
      `CREATE TYPE "document_guest_accesslevel_enum" AS ENUM('1', '2')`,
    );
    await queryRunner.query(
      `CREATE TYPE "document_privacy_enum" AS ENUM('1', '2', '3')`,
    );
    // alter node
    await queryRunner.query(
      `ALTER TABLE "node" DROP CONSTRAINT "FK_49e3f89e68914252136980d77ac"`,
    );
    await queryRunner.query(`ALTER TABLE "node" DROP COLUMN "userId"`);
    await queryRunner.query(
      `ALTER TABLE "node" ADD "privacy" "document_privacy_enum"`,
    );
    // alter document
    await queryRunner.query(
      `ALTER TABLE "document" ADD "privacy" "document_privacy_enum" NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "document" ALTER COLUMN "updatedAt" SET DATA TYPE timestamp with time zone;`,
    );
    await queryRunner.query(
      `ALTER TABLE "document" ALTER COLUMN "createdAt" SET DATA TYPE timestamp with time zone;`,
    );
    // create document_guest
    await queryRunner.query(
      `CREATE TABLE "document_guest" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "documentId" character varying NOT NULL, "accessLevel" "document_guest_accesslevel_enum" NOT NULL,  CONSTRAINT "UQ_93146e1514549a6005a873a26ef" UNIQUE ("userId", "documentId"), CONSTRAINT "PK_81b7502f2f9bd98bf7c846fb006" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "document_guest" ADD CONSTRAINT "FK_606e8ed2980287023f71fc2e346" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "document_guest" ADD CONSTRAINT "FK_03765107136b8a876f1d47c49d8" FOREIGN KEY ("documentId") REFERENCES "document"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // alter document
    await queryRunner.query(
      `ALTER TABLE "document" ALTER COLUMN "updatedAt" SET DATA TYPE timestamp;`,
    );
    await queryRunner.query(
      `ALTER TABLE "document" ALTER COLUMN "createdAt" SET DATA TYPE timestamp;`,
    );
    await queryRunner.query(`ALTER TABLE "document" DROP COLUMN "privacy"`);
    // alter node
    await queryRunner.query(`ALTER TABLE "node" ADD "userId" uuid NOT NULL`);
    await queryRunner.query(`ALTER TABLE "node" DROP COLUMN "privacy"`);
    await queryRunner.query(
      `ALTER TABLE "node" ADD CONSTRAINT "FK_49e3f89e68914252136980d77ac" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    // drop document guest
    await queryRunner.query(
      `ALTER TABLE "document_guest" DROP CONSTRAINT "FK_03765107136b8a876f1d47c49d8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "document_guest" DROP CONSTRAINT "FK_606e8ed2980287023f71fc2e346"`,
    );
    await queryRunner.query(`DROP TABLE "document_guest"`);

    // types
    await queryRunner.query(`DROP TYPE "document_guest_accesslevel_enum"`);
    await queryRunner.query(`DROP TYPE "document_privacy_enum"`);
  }
}
