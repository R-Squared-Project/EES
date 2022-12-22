import amqp, {Channel} from "amqplib";
import config from "context/config";

const EXCHANGE_NAME = 'deposit';
const EXCHANGE_TYPE = 'direct';
const EXCHANGE_OPTION = {
    durable: true
};

export default class RabbitMQ {
    private channel: Channel | null = null;

    public async init(queueName: string) {
        const connection = await amqp.connect(config.rabbitmq.url);
        this.channel = await connection.createChannel();
        await this.channel.assertExchange(EXCHANGE_NAME, EXCHANGE_TYPE, EXCHANGE_OPTION);
        const queue = await this.channel.assertQueue(queueName);
        await this.channel.bindQueue(queue.queue, EXCHANGE_NAME, queueName)
    }

    public async publish(key: string, msg: any) {
        (this.channel as Channel).publish(EXCHANGE_NAME, key, Buffer.from(
            JSON.stringify(msg)
        ));
    }
}
