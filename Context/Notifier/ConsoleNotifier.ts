import NotifierInterface from "context/Notifier/NotifierInterface";
import {Injectable} from "@nestjs/common";

@Injectable()
export default class ConsoleNotifier implements NotifierInterface{
    async sendMessage(message: string): Promise<void> {
        console.log('Notification: ', message);
    }

}
