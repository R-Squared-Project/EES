import amqp, {Channel, Connection} from "amqplib";
import config from "context/config";
import {ConsumeMessage} from "amqplib/properties";
import {Injectable} from "@nestjs/common";

const EXCHANGE_NAME = 'deposit';
const EXCHANGE_TYPE = 'direct';
const EXCHANGE_OPTION = {
    durable: true
};

@Injectable()
export default class RabbitMQ {
    public readonly MONITOR_EXTERNAL_CONTRACT_REDEEM = 'monitor_external_contract_redeem';
    private channel: Channel | null = null;
    private connection: Connection | null = null

    public async initProduce() {
        await this.connect()
    }

    public async consume<T>(queueName: string, onMessage: (msg: T, ack: () => void, nack: () => void) => void) {
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
            }, () => {
                channel.nack(msg)
            })
        }, {
            noAck: false
        });
    }

    public async publish(key: string, msg: any) {
        await this.connect()
        const channel = this.channel as Channel
        channel.publish(EXCHANGE_NAME, key, Buffer.from(
            JSON.stringify(msg)
        ), {
            persistent: true
        });
    }

    private async connect() {
        if (this.connection && this.channel) {
            return;
        }
        this.connection = await amqp.connect({
            hostname: config.rabbitmq.host,
            port: config.rabbitmq.port
        });
        this.channel = await this.connection.createChannel();
        await this.channel.assertExchange(EXCHANGE_NAME, EXCHANGE_TYPE, EXCHANGE_OPTION);
    }

    public async disconnect() {
        this.connection?.close()
    }
}
