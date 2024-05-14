import { Module } from '@nestjs/common';
import { S3Service } from './s3.service';
import { S3Controller } from './s3.controller';

@Module({
  controllers: [S3Controller],
  exports: [S3Service],
  providers: [S3Service],
})
export class S3Module {}
