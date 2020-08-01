import { MigrationInterface, QueryRunner } from 'typeorm';
// eslint-disable-next-line @typescript-eslint/class-name-casing
export class guestEmail1595766231097 implements MigrationInterface {
  name = 'guestEmail1595766231097';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "document_guest" ADD "email" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "document_guest" DROP COLUMN "email"`);
  }
}
