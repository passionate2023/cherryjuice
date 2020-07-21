import { MigrationInterface, QueryRunner } from 'typeorm';

// eslint-disable-next-line @typescript-eslint/class-name-casing
export class ownership1595242456491 implements MigrationInterface {
  name = 'ownership1595242456491';
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "node" DROP CONSTRAINT "FK_49e3f89e68914252136980d77ac"`,
    );
    await queryRunner.query(
      `ALTER TABLE "document" DROP CONSTRAINT "FK_7424ddcbdf1e9b067669eb0d3fd"`,
    );
    await queryRunner.query(
      `CREATE TYPE "document_owner_ownershiplevel_enum" AS ENUM('0', '1', '2')`,
    );
    await queryRunner.query(
      `CREATE TABLE "document_owner" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "documentId" character varying NOT NULL, "ownershipLevel" "document_owner_ownershiplevel_enum" NOT NULL, "public" boolean NOT NULL, CONSTRAINT "UQ_93146e1514549a6005a873a26ef" UNIQUE ("userId", "documentId"), CONSTRAINT "PK_81b7502f2f9bd98bf7c846fb006" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "node_owner_ownershiplevel_enum" AS ENUM('0', '1', '2')`,
    );
    await queryRunner.query(
      `CREATE TABLE "node_owner" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "documentId" character varying NOT NULL, "ownershipLevel" "node_owner_ownershiplevel_enum" NOT NULL, "public" boolean NOT NULL, "nodeId" uuid NOT NULL, "node_id" integer NOT NULL,  CONSTRAINT "UQ_c63e4f3bb07b4f96597645d2b06" UNIQUE ("node_id", "documentId"), CONSTRAINT "UQ_6a2d5837c8334a157491bacc66b" UNIQUE ("nodeId", "documentId"), CONSTRAINT "PK_8ffa491fa96eb26764dcf9a81fd" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "node" DROP COLUMN "userId"`);
    await queryRunner.query(`ALTER TABLE "document" DROP COLUMN "userId"`);
    await queryRunner.query(
      `ALTER TABLE "document" ALTER COLUMN "updatedAt" SET DATA TYPE timestamp with time zone;`,
    );
    await queryRunner.query(
      `ALTER TABLE "document" ALTER COLUMN "createdAt" SET DATA TYPE timestamp with time zone;`,
    );
    await queryRunner.query(
      `ALTER TABLE "document_owner" ADD CONSTRAINT "FK_606e8ed2980287023f71fc2e346" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "document_owner" ADD CONSTRAINT "FK_03765107136b8a876f1d47c49d8" FOREIGN KEY ("documentId") REFERENCES "document"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "node_owner" ADD CONSTRAINT "FK_ef555d58eff820278baa3dcf717" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "node_owner" ADD CONSTRAINT "FK_91a7d21964517f3c60bcfb1e0a4" FOREIGN KEY ("documentId") REFERENCES "document"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "node_owner" ADD CONSTRAINT "FK_6839211fcd3bb2510aa931110a5" FOREIGN KEY ("nodeId") REFERENCES "node"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "node_owner" DROP CONSTRAINT "FK_6839211fcd3bb2510aa931110a5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "node_owner" DROP CONSTRAINT "FK_91a7d21964517f3c60bcfb1e0a4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "node_owner" DROP CONSTRAINT "FK_ef555d58eff820278baa3dcf717"`,
    );
    await queryRunner.query(
      `ALTER TABLE "document_owner" DROP CONSTRAINT "FK_03765107136b8a876f1d47c49d8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "document_owner" DROP CONSTRAINT "FK_606e8ed2980287023f71fc2e346"`,
    );
    await queryRunner.query(
      `ALTER TABLE "document" ALTER COLUMN "updatedAt" SET DATA TYPE timestamp;`,
    );
    await queryRunner.query(
      `ALTER TABLE "document" ALTER COLUMN "createdAt" SET DATA TYPE timestamp;`,
    );

    await queryRunner.query(
      `ALTER TABLE "document" ADD "userId" uuid NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "node" ADD "userId" uuid NOT NULL`);
    await queryRunner.query(`DROP TABLE "node_owner"`);
    await queryRunner.query(`DROP TYPE "node_owner_ownershiplevel_enum"`);
    await queryRunner.query(`DROP TABLE "document_owner"`);
    await queryRunner.query(`DROP TYPE "document_owner_ownershiplevel_enum"`);
    await queryRunner.query(
      `ALTER TABLE "document" ADD CONSTRAINT "FK_7424ddcbdf1e9b067669eb0d3fd" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "node" ADD CONSTRAINT "FK_49e3f89e68914252136980d77ac" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}
