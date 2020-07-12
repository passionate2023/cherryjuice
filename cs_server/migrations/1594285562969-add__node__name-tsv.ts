import { MigrationInterface, QueryRunner } from 'typeorm';

// eslint-disable-next-line @typescript-eslint/class-name-casing
export class add_node_nameTsv1594285562969 implements MigrationInterface {
  name = 'add_node_nameTsv1594285562969';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE node
      ADD COLUMN name_tsv tsvector
      GENERATED ALWAYS AS (to_tsvector('english', name)) STORED ;

      CREATE INDEX name_tsv_idx
      ON node
      USING GIN (name_tsv);`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    DROP INDEX IF EXISTS name_tsv_idx;
    ALTER TABLE "node" DROP COLUMN "name_tsv";`);
  }
}
