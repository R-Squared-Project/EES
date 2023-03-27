export default interface NotifierInterface {
    sendMessage(message: string): Promise<void>
}
