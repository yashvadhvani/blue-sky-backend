import { MigrationInterface, QueryRunner } from 'typeorm';
import { createReadStream, promises as fsPromises } from 'fs';
import { Transform } from 'stream';
import { BUCKET_NAME, PEOPLE } from '../constants';

const getParsedData = (line: string) => {
  const commaIndex: number = line.indexOf(',');
  const secondCommaIndex: number = line.indexOf(',', commaIndex + 1);
  const feature = JSON.parse(line.substring(secondCommaIndex + 1));
  return {
    first_name: line.substring(0, commaIndex).trim(),
    last_name: line.substring(commaIndex + 1, secondCommaIndex).trim(),
    location: JSON.stringify({
      type: feature.geometry.type,
      coordinates: feature.geometry.coordinates,
    }),
  };
};

const insertData = async (queryRunner: QueryRunner, data: string[]) => {
  try {
    const query = `
      INSERT INTO "${PEOPLE}" ("first_name", "last_name", "location")
      VALUES
        ${data
          .map(
            (_, index) =>
              `($${index * 3 + 1}, $${index * 3 + 2}, ST_GeomFromGeoJSON($${
                index * 3 + 3
              })::geometry(Point, 4326))`,
          )
          .join(', ')}
    `;

    const values = data.flatMap((line) => {
      const person = getParsedData(line);
      return [person.first_name, person.last_name, person.location];
    });

    await queryRunner.query(query, values);
  } catch (error) {
    console.error('Error inserting data:', error);
  }
};

const streamListner = async (queryRunner: QueryRunner) => {
  let incompleteLine = ''; // Store the incomplete line from the previous chunk
  let ignoreFirstLine = true;
  return new Promise((resolve) => {
    console.log('SEED PEOPLE TABLE START');
    const individualStream = createReadStream(
      'backend-assignment/individuals.csv',
    );
    individualStream.pipe(
      new Transform({
        async transform(chunk, encoding, callback) {
          let data = chunk.toString();

          if (incompleteLine) {
            data = incompleteLine + data;
            incompleteLine = ''; // Reset incompleteLine
          }

          const lines: string[] = data.split('\n');

          incompleteLine = lines.pop();
          if (ignoreFirstLine) {
            lines.shift();
            ignoreFirstLine = false;
          }
          await insertData(queryRunner, lines);

          callback();
        },
      }),
    );
    individualStream.on('end', () => {
      console.log('SEED PEOPLE TABLE END');
      resolve(true);
    });
  });
};

export class SeedPeopleTable1694373027367 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await streamListner(queryRunner);
    console.log('REMOVE LOCAL FILES START');
    await fsPromises.rm(BUCKET_NAME, { recursive: true, force: true });
    console.log('REMOVE LOCAL FILES END');
    return;
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    console.log('LL: SeedPeopleTable1694373027367 -> queryRunner', queryRunner);
  }
}
