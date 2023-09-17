import { MigrationInterface, QueryRunner } from 'typeorm';
export class CreateTables1694373027365 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE public.states (
        "id" serial PRIMARY KEY,
        "name" varchar(255) NOT NULL,
        "type" varchar(255) NOT NULL,
        "boundary" geometry(Geometry, 4326) NOT NULL
      );
    `);

    await queryRunner.query(`
      CREATE TABLE public.people (
        "id" serial PRIMARY KEY,
        "first_name" varchar(255) NOT NULL,
        "last_name" varchar(255) NOT NULL,
        "location" geometry(Point, 4326) NOT NULL
        )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE public.states;`);
    await queryRunner.query(`DROP TABLE public.people;`);
  }
}
