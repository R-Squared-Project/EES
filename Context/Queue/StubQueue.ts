import QueueInterface from "context/Queue/QueueInterface";

export default class StubQueue implements QueueInterface {
    public key = "";
    public message: any = null;
    consume<T>(queueName: string, onMessage: (msg: T, ack: () => void, nack: () => void) => void): Promise<void> {
        return Promise.resolve(undefined);
    }

    initProduce(): Promise<void> {
        return Promise.resolve(undefined);
    }

    publish(key: string, message: any): Promise<void> {
        this.key = key;
        this.message = message;
        return Promise.resolve(undefined);
    }
}
