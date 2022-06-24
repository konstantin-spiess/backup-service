import { S3 } from 'aws-sdk';
import { ManagedUpload } from 'aws-sdk/clients/s3';
import { createReadStream } from 'fs';
import { Transform } from 'stream';

/**
 * Upload a file to Cloudflare R2.
 * @param path path of the file to upload
 * @param key key of the file in the R2 bucket
 * @returns a promise that resolves to the upload response
 */
export async function uploadFile(path: string, key: string): Promise<ManagedUpload.SendData> {
  return new Promise<ManagedUpload.SendData>((resolve, reject) => {
    if (
      !process.env.ACCOUNT_ID ||
      !process.env.R2_ACCESS_KEY_ID ||
      !process.env.R2_SECRET_ACCESS_KEY ||
      !process.env.R2_BUCKET_NAME
    ) {
      return reject(new Error('Missing environment variables.'));
    }

    const data = createReadStream(path);

    const s3 = new S3({
      endpoint: `https://${process.env.ACCOUNT_ID}.r2.cloudflarestorage.com`,
      accessKeyId: `${process.env.R2_ACCESS_KEY_ID}`,
      secretAccessKey: `${process.env.R2_SECRET_ACCESS_KEY}`,
    });

    const params = {
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
      Body: data,
    };

    console.log('Starting file upload.');

    s3.upload(params)
      .promise()
      .then((response) => {
        console.log('Completed file upload.');
        resolve(response);
      })
      .catch((err) => {
        reject(err);
      });
  });
}
