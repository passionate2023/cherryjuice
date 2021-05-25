import { MigrationInterface, QueryRunner } from 'typeorm';

// eslint-disable-next-line @typescript-eslint/class-name-casing
export class initial1594212322573 implements MigrationInterface {
  name = 'initial1594212322573';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "image" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "nodeId" uuid NOT NULL, "documentId" character varying, "thumbnail" bytea NOT NULL, "image" bytea NOT NULL, "hash" character varying, CONSTRAINT "PK_d6db1ab4ee9ad9dbe86c64e4cc3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying NOT NULL, "email" character varying NOT NULL, "lastName" character varying NOT NULL, "firstName" character varying NOT NULL, "password" character varying NOT NULL, "salt" character varying NOT NULL, "thirdPartyId" character varying, "thirdParty" character varying, "picture" character varying, "email_verified" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "node" ("documentId" character varying NOT NULL, "fatherId" uuid, "userId" uuid NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "father_id" smallint NOT NULL, "node_id" integer NOT NULL, "child_nodes" text NOT NULL, "name" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "node_title_styles" character varying, "ahtml" character varying NOT NULL DEFAULT '[]', "read_only" smallint NOT NULL DEFAULT 0, "hash" character varying, "ahtml_txt" character varying NOT NULL DEFAULT '', CONSTRAINT "UQ_db25a9e19c2740233e30a2256be" UNIQUE ("node_id", "documentId"), CONSTRAINT "PK_8c8caf5f29d25264abe9eaf94dd" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "document" ("id" character varying NOT NULL, "userId" uuid NOT NULL, "name" text NOT NULL, "size" integer NOT NULL DEFAULT 0, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "status" character varying, "nodes" json DEFAULT '{}', "hash" character varying, CONSTRAINT "PK_e57d3357f83f3cdc0acffc3d777" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "image" ADD CONSTRAINT "FK_a9d2b69986adda374b988eb3a43" FOREIGN KEY ("nodeId") REFERENCES "node"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "node" ADD CONSTRAINT "FK_c3d4623567d80fbd1d0475795fe" FOREIGN KEY ("documentId") REFERENCES "document"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "node" ADD CONSTRAINT "FK_6a9912b0a3e67148dcf5097b297" FOREIGN KEY ("fatherId") REFERENCES "node"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "node" ADD CONSTRAINT "FK_49e3f89e68914252136980d77ac" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "document" ADD CONSTRAINT "FK_7424ddcbdf1e9b067669eb0d3fd" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "document" DROP CONSTRAINT "FK_7424ddcbdf1e9b067669eb0d3fd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "node" DROP CONSTRAINT "FK_49e3f89e68914252136980d77ac"`,
    );
    await queryRunner.query(
      `ALTER TABLE "node" DROP CONSTRAINT "FK_6a9912b0a3e67148dcf5097b297"`,
    );
    await queryRunner.query(
      `ALTER TABLE "node" DROP CONSTRAINT "FK_c3d4623567d80fbd1d0475795fe"`,
    );
    await queryRunner.query(
      `ALTER TABLE "image" DROP CONSTRAINT "FK_a9d2b69986adda374b988eb3a43"`,
    );
    await queryRunner.query(`DROP TABLE "document"`);
    await queryRunner.query(`DROP TABLE "node"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "image"`);
  }
}
