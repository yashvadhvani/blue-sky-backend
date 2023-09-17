import { MigrationInterface, QueryRunner } from 'typeorm';
import { Transform } from 'stream';

import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { Readable } from 'typeorm/platform/PlatformTools';

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
  // const
  try {
    const query = `
      INSERT INTO "people" ("first_name", "last_name", "location")
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

const streamListner = (queryRunner) => {
  const bucketName = 'backend-assignment';
  let incompleteLine = ''; // Store the incomplete line from the previous chunk
  let ignoreFirstLine = true;
  return new Promise(async (resolve) => {
    // let continueExec = true;
    const client = new S3Client({
      region: 'us-east-2',
      signer: { sign: async (request) => request },
    });

    const objectResponse = await client.send(
      new GetObjectCommand({
        Bucket: bucketName,
        Key: 'individuals.csv',
      }),
    );

    if (objectResponse.Body) {
      const readableStream = objectResponse.Body as Readable;
      readableStream.pipe(
        new Transform({
          transform(chunk, encoding, callback) {
            let data = chunk.toString();

            // If there's an incomplete line from the previous chunk, prepend it to the current data
            if (incompleteLine) {
              data = incompleteLine + data;
              incompleteLine = ''; // Reset incompleteLine
            }

            const lines: string[] = data.split('\n');

            // The last element of 'lines' may be an incomplete line, so store it in incompleteLine
            incompleteLine = lines.pop();
            if (ignoreFirstLine) {
              lines.shift();
              ignoreFirstLine = false;
            }
            insertData(queryRunner, lines);
            callback();
          },
        }),
      );
      readableStream.on('end', () => resolve(true));
    } else {
      resolve(true);
    }
  });
};

export class SeedPeopleTable1694373027367 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await streamListner(queryRunner);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    console.log('LL: SeedPeopleTable1694373027367 -> queryRunner', queryRunner);
  }
}
