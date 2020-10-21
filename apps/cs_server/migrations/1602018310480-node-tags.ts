import { MigrationInterface, QueryRunner } from 'typeorm';

// eslint-disable-next-line @typescript-eslint/class-name-casing
export class nodeTags1602018310480 implements MigrationInterface {
  name = 'nodeTags1602018310480';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "node" ADD "tags" text`);

    await queryRunner.query(`
      ALTER TABLE node
      ADD COLUMN tags_tsv tsvector
      GENERATED ALWAYS AS (to_tsvector('english', tags)) STORED ;

      CREATE INDEX tags_tsv_idx
      ON node
      USING GIN (tags_tsv);`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "node" DROP COLUMN "tags"`);
    await queryRunner.query(`
    DROP INDEX IF EXISTS tags_tsv_idx;
    ALTER TABLE "node" DROP COLUMN "tags_tsv";`);
  }
}
