import InternalBlockchain from "context/InternalBlockchain/InternalBlockchain";
import CreateContractInInternalBlockchain
    from "context/Application/Command/InternalBlockchain/CreateContractInInternalBlockchainHandler/CreateContractInInternalBlockchain";
import CreateContractInInternalBlockchainHandler
    from "context/Application/Command/InternalBlockchain/CreateContractInInternalBlockchainHandler/CreateContractInInternalBlockchainHandler";
import DepositTypeOrmRepository from "context/Infrastructure/TypeORM/DepositRepository";
import DataSource from "context/Infrastructure/TypeORM/DataSource/DataSource";
import EtherToWrappedEtherConverter from "context/Infrastructure/EtherToWrappedEtherConverter";
import RabbitMQ from "context/Queue/RabbitMQ";

interface CreateInInternalBlockchainMessage {
    deposit_id: string
}

let internalBlockchain: InternalBlockchain

async function main() {
    const depositRepository = new DepositTypeOrmRepository(DataSource)
    internalBlockchain = await InternalBlockchain.init({
        repository: 'revpop'
    })
    const converter = new EtherToWrappedEtherConverter()
    const handler = new CreateContractInInternalBlockchainHandler(depositRepository, internalBlockchain, converter)
    const messenger = new RabbitMQ()

    messenger.consume<CreateInInternalBlockchainMessage>(
        'create_in_internal_blockchain',
        async (message: CreateInInternalBlockchainMessage, ack) => {
            const command = new CreateContractInInternalBlockchain(message.deposit_id)

            try {
                await handler.execute(command)
                ack()
                console.log(`HTLC contract submitted in an internal blockchain: ${message.deposit_id}`)
            } catch (e: unknown) {
                console.log(e)
                //TODO::nack?
            }
        }
    )
}

process.on('SIGINT', () => {
    internalBlockchain.disconnect()
});

main()
