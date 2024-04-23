import { forwardRef, Module } from '@nestjs/common';
import { ConsumerService } from './services/queues.consumer';
import { ProducerService } from './services/queues.producer';
import { BlogsModule } from '../blogs/blogs.module';

@Module({
  imports: [forwardRef(() => BlogsModule)],
  providers: [ProducerService, ConsumerService],
  exports: [ProducerService, ConsumerService],
})
export class QueueModule {}
