import { MigrationInterface, QueryRunner } from 'typeorm';

// eslint-disable-next-line @typescript-eslint/class-name-casing
export class timestampWithTz1594811105334 implements MigrationInterface {
  name = 'timestampWithTz1594811105334';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "node" ALTER COLUMN "createdAt" SET DATA TYPE timestamp with time zone;`,
    );
    await queryRunner.query(
      `ALTER TABLE "node" ALTER COLUMN "updatedAt" SET DATA TYPE timestamp with time zone;`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "node" ALTER COLUMN "createdAt" SET DATA TYPE timestamp;`,
    );
    await queryRunner.query(
      `ALTER TABLE "node" ALTER COLUMN "updatedAt" SET DATA TYPE timestamp;`,
    );
  }
}
