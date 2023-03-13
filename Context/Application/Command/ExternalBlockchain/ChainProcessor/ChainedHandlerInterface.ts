import ChainedHandlerCommand
    from "context/Application/Command/ExternalBlockchain/ChainProcessor/ChainedHandlerCommand";

export default interface ChainedHandlerInterface {
    execute(command: ChainedHandlerCommand): Promise<void>

}
