import { Injectable } from '@nestjs/common';
import process from 'process';
import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import * as dotenv from 'dotenv';
import { ConfigService } from '@nestjs/config/dist/config.service';
import { getUrlFromBucket } from './utilits/getUrl';

@Injectable()
export class S3Service {
  private readonly config: any;
  private readonly s3Client: any;
  constructor(configservice: ConfigService) {
    dotenv.config();

    const credentials = {
      accessKeyId: configservice.get<string>('AWS_ACCESS_KEY_ID'),
      secretAccessKey: configservice.get<string>('AWS_SECRET_ACCESS_KEY'),
    };
    this.config = {
      region: configservice.get<string>('AWS_REGION'),
      credentials,
    };
    this.s3Client = new S3Client(this.config);
  }

  async uploadIMG(userPD: object, file: Express.Multer.File, bucketName: string, type: 'DP' | 'BLOG', blogPD?: object) {
    let objPath: string, objExt: string;
    const id = userPD['userId'];
    const username = userPD['username'];
    if (type === 'DP') {
      objPath = `user-profile-images/${id}`;
      objExt = file.mimetype.split('/')[1];
    }
    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: `${objPath}/${username}.${objExt}`,
        Body: file.buffer,
      }),
    );
  }

  async ReadIMG(userPD: object, bucketName: string, type: 'DP' | 'BLOG', region: string) {
    try {
      const id = userPD['userId'];
      const username = userPD['username'];
      let key;
      if (type === 'DP') {
        key = `user-profile-images/${id}/${username}.jpeg`;
      }

      // S3 api call .
      // const { Body } = await this.s3Client.send(
      //   new GetObjectCommand({
      //     Bucket: bucketName,
      //     Key: key,
      //   }),
      // );

      return getUrlFromBucket(bucketName, key);
    } catch (error) {
      console.error('Error fetching image from S3:', error);
      throw error;
    }
  }
}
