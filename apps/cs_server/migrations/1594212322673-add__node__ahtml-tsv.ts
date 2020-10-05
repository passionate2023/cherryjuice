import { MigrationInterface, QueryRunner } from 'typeorm';

// eslint-disable-next-line @typescript-eslint/class-name-casing
export class add_node_ahtmlTsv1594212322673 implements MigrationInterface {
  name = 'add_node_ahtmlTsv1594212322673';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE node
      ADD COLUMN ahtml_tsv tsvector
      GENERATED ALWAYS AS (to_tsvector('english', ahtml_txt)) STORED ;

      CREATE INDEX ahtml_tsv_idx
      ON node
      USING GIN (ahtml_tsv);`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    DROP INDEX IF EXISTS ahtml_tsv_idx;
    ALTER TABLE "node" DROP COLUMN "ahtml_tsv";`);
  }
}
