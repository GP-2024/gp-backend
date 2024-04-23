import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import amqp, { ChannelWrapper } from 'amqp-connection-manager';
import { ConfirmChannel } from 'amqplib';
import { BlogsService } from '../../blogs/blogs.service';

@Injectable()
export class ConsumerService implements OnModuleInit {
  private channelWrapper: ChannelWrapper;
  private readonly logger = new Logger(ConsumerService.name);
  constructor(private blogsService: BlogsService) {
    const connection = amqp.connect([process.env.RMQ_CONNECTION]);
    this.channelWrapper = connection.createChannel();
  }

  public async onModuleInit() {
    try {
      await this.channelWrapper.addSetup(async (channel: ConfirmChannel) => {
        await channel.assertQueue('likeQueue', { durable: true });
        await channel.consume('likeQueue', async (message) => {
          if (message) {
            const content = JSON.parse(message.content.toString());
            this.logger.log('Received message');
            await this.blogsService.likeSave(content);
            channel.ack(message);
          }
        });
      });
      this.logger.log('Consumer service started and listening for messages.');
    } catch (err) {
      this.logger.error('Error starting the consumer:', err);
    }
  }
}
