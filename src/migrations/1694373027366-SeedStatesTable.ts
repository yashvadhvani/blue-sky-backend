import { MigrationInterface, QueryRunner } from 'typeorm';

import {
  S3Client,
  // This command supersedes the ListObjectsCommand and is the recommended way to list objects.
  ListObjectsV2Command,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { Readable } from 'stream';

// Helper function to convert a Readable stream to a string
async function streamToString(stream: any) {
  return new Promise((resolve, reject) => {
    const chunks: any[] = [];
    stream.on('data', (chunk: any) => chunks.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
    stream.on('error', (err: any) => reject(err));
  });
}

export class SeedStatesTable1694373027366 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const client = new S3Client({
      region: 'us-east-2',
      signer: { sign: async (request) => request },
    });
    // Loop through the array and insert each state data object
    const bucketName = 'backend-assignment';
    const command = new ListObjectsV2Command({
      Bucket: bucketName,
      Prefix: 'states/',
      MaxKeys: 1000,
      Delimiter: '/',
    });

    try {
      let isTruncated = true;

      while (isTruncated) {
        const { Contents, IsTruncated, NextContinuationToken } =
          await client.send(command);

        if (Contents) {
          for (const obj of Contents) {
            const getObjectParams = {
              Bucket: bucketName,
              Key: obj.Key,
            };
            const objectResponse = await client.send(
              new GetObjectCommand(getObjectParams),
            );
            if (objectResponse && objectResponse.Body) {
              let objectContent: any =
                objectResponse.Body instanceof Readable
                  ? await streamToString(objectResponse.Body)
                  : objectResponse.Body.toString();

              if (objectContent.length > 0) {
                objectContent = JSON.parse(objectContent);

                const feature = objectContent.features[0];

                await queryRunner.query(
                  `INSERT INTO public.states ("name", "type", "boundary") VALUES ($1, $2, ST_GeomFromGeoJSON($3)::geometry(Geometry, 4326))`,
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
            }
          }
        }
        isTruncated = IsTruncated as boolean;
        command.input.ContinuationToken = NextContinuationToken;
      }
    } catch (err) {
      console.error(err);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    console.log('LL: SeedStatesTable1632171000000 -> queryRunner', queryRunner);
    // You can define a down migration logic here if needed
  }
}
