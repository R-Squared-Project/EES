import amqp, {Channel} from "amqplib";
import config from "context/config";
import {ConsumeMessage} from "amqplib/properties";

const EXCHANGE_NAME = 'deposit';
const EXCHANGE_TYPE = 'direct';
const EXCHANGE_OPTION = {
    durable: true
};

export default class RabbitMQ {
    private channel: Channel | null = null;

    public async initProduce() {
        await this.connect()
    }

    public async consume<T>(queueName: string, onMessage: (msg: T, ack: () => void) => void) {
        await this.connect()
        const channel = this.channel as Channel

        const queue = await channel.assertQueue(queueName);
        await channel.bindQueue(queue.queue, EXCHANGE_NAME, queueName)

        channel.consume(queue.queue, (msg: ConsumeMessage | null) => {
            if (null === msg) {
                return
            }

            console.log(" [x] %s:'%s'", msg.fields.routingKey, msg.content.toString());
            onMessage(JSON.parse(msg.content.toString()), () => {
                channel.ack(msg)
            })
        }, {
            noAck: false
        });
    }

    public async publish(key: string, msg: any) {
        const channel = this.channel as Channel
        channel.publish(EXCHANGE_NAME, key, Buffer.from(
            JSON.stringify(msg)
        ), {
            persistent: true
        });
    }

    private async connect() {
        const connection = await amqp.connect(config.rabbitmq.url);
        this.channel = await connection.createChannel();
        await this.channel.assertExchange(EXCHANGE_NAME, EXCHANGE_TYPE, EXCHANGE_OPTION);
    }
}
