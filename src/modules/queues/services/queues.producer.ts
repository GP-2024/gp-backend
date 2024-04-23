import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import amqp, { ChannelWrapper } from 'amqp-connection-manager';
import { Channel } from 'amqplib';
import { likeType } from '../types/like.type';

@Injectable()
export class ProducerService {
  private channelWrapper: ChannelWrapper;
  constructor() {
    const connection = amqp.connect([process.env.RMQ_CONNECTION]);
    this.channelWrapper = connection.createChannel({
      setup: (channel: Channel) => {
        return channel.assertQueue('likeQueue', { durable: true });
      },
    });
  }

  async addToLikesQueue(like: likeType) {
    try {
      await this.channelWrapper.sendToQueue('likeQueue', Buffer.from(JSON.stringify(like)), {
        persistent: true,
      });
      Logger.log('Sent To Queue');
    } catch (error) {
      throw new HttpException('Error adding like to queue', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
