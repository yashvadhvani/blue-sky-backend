import { MigrationInterface, QueryRunner } from 'typeorm';
import { promises as fsPromises } from 'fs';
import { STATES } from '../constants';

export class SeedStatesTable1694373027366 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    console.log('SEED STATES TABLE START');
    const files = await fsPromises.readdir('backend-assignment/states');
    for (const file of files) {
      const data = JSON.parse(
        (
          await fsPromises.readFile(`backend-assignment/states/${file}`)
        ).toString(),
      );
      const feature = data.features[0];
      await queryRunner.query(
        `INSERT INTO "${STATES}" ("name", "type", "boundary") VALUES ($1, $2, ST_GeomFromGeoJSON($3)::geometry(Geometry, 4326))`,
        [
          feature.properties.name,
          feature.geometry.type,
          JSON.stringify({
            type: feature.geometry.type,
            coordinates: feature.geometry.coordinates,
          }),
        ],
      );
    }
    console.log('SEED STATES TABLE END');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    console.log('LL: SeedStatesTable1632171000000 -> queryRunner', queryRunner);
  }
}
