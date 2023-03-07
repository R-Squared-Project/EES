import BlockRange from "context/Application/Command/ExternalBlockchain/ChainProcessor/BlockRange";

export default interface ExternalBlockchainHandlerInterface {
    execute(range: BlockRange): Promise<void>

}