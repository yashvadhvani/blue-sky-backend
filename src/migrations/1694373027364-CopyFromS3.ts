import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { MigrationInterface } from 'typeorm';
import { Readable } from 'typeorm/platform/PlatformTools';
import { promises as fsPromises, createWriteStream } from 'fs';
import * as decompress from 'decompress';
import { AWS_REGION, BUCKET_NAME } from '../constants';

export class CopyFromS31694373027364 implements MigrationInterface {
  public async up(): Promise<void> {
    return new Promise(async (resolve) => {
      console.log('Zip Download Start');
      const bucketName = BUCKET_NAME;
      const client = new S3Client({
        region: AWS_REGION,
        signer: { sign: async (request) => request },
      });
      const getObjectParams = {
        Bucket: bucketName,
        Key: 'backend-assignment.zip',
      };
      const objectResponse = await client.send(
        new GetObjectCommand(getObjectParams),
      );
      if (objectResponse.Body) {
        const readableStream = objectResponse.Body as Readable;
        const ws = createWriteStream('data.zip');
        readableStream.pipe(ws);
        readableStream.on('end', async () => {
          console.log('Zip Download Complete');
          console.log('DeCompress Start');
          await decompress('data.zip', '.');
          console.log('DeCompress End');
          await fsPromises.unlink('data.zip');
          console.log('Zip Deleted');
          resolve();
        });
      }
    });
  }
  public async down(): Promise<void> {}
}
