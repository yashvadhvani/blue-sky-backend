import { PEOPLE, STATES } from '../constants';
import { MigrationInterface, QueryRunner } from 'typeorm';
export class CreateTables1694373027365 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    console.log('CREATE TABLE START');
    await queryRunner.query(`
      CREATE TABLE public.${STATES} (
        "id" serial PRIMARY KEY,
        "name" varchar(255) NOT NULL,
        "type" varchar(255) NOT NULL,
        "boundary" geometry(Geometry, 4326) NOT NULL
      );
    `);

    await queryRunner.query(`
      CREATE TABLE public.${PEOPLE} (
        "id" serial PRIMARY KEY,
        "first_name" varchar(255) NOT NULL,
        "last_name" varchar(255) NOT NULL,
        "location" geometry(Point, 4326) NOT NULL
        )
    `);
    await queryRunner.query(`
      CREATE INDEX idx_boundary
      ON public.${STATES}
      USING GIST (boundary);
    `);
    console.log('CREATE TABLE END');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE public.${STATES};`);
    await queryRunner.query(`DROP TABLE public.${PEOPLE};`);
    await queryRunner.query(`
      DROP INDEX IF EXISTS idx_boundary;
    `);
  }
}
