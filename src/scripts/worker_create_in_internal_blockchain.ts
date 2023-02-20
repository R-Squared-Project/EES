import yargs from 'yargs'
import InternalBlockchain from "context/InternalBlockchain/InternalBlockchain";
import CreateContractInInternalBlockchain
    from "context/Application/Command/InternalBlockchain/CreateContractInInternalBlockchain/CreateContractInInternalBlockchain";
import CreateContractInInternalBlockchainHandler
    from "context/Application/Command/InternalBlockchain/CreateContractInInternalBlockchain/CreateContractInInternalBlockchainHandler";
import DepositTypeOrmRepository from "context/Infrastructure/TypeORM/DepositRepository";
import DataSource from "context/Infrastructure/TypeORM/DataSource/DataSource";
import EtherToWrappedEtherConverter from "context/Infrastructure/EtherToWrappedEtherConverter";
import RabbitMQ from "context/Queue/RabbitMQ";

yargs(process.argv.slice(2))
    .usage('Connect to a RabbitMQ server and consume new messages. Create new contract in an internal blockchain')
    .help()
    .parseSync()

interface CreateInInternalBlockchainMessage {
    deposit_id: string
}

let internalBlockchain: InternalBlockchain
let messenger: RabbitMQ

async function main() {
    const depositRepository = new DepositTypeOrmRepository(DataSource)
    internalBlockchain = await InternalBlockchain.init({
        repository: 'revpop'
    })
    const converter = new EtherToWrappedEtherConverter()
    const handler = new CreateContractInInternalBlockchainHandler(depositRepository, internalBlockchain, converter)
    messenger = new RabbitMQ()

    messenger.consume<CreateInInternalBlockchainMessage>(
        'create_in_internal_blockchain',
        async (message: CreateInInternalBlockchainMessage, ack, nack) => {
            const command = new CreateContractInInternalBlockchain(message.deposit_id)

            try {
                await handler.execute(command)
                ack()
                console.log(`HTLC contract submitted in an internal blockchain: ${message.deposit_id}`)
            } catch (e: unknown) {
                nack()
                console.log(`Error occurred while HTLC contract submitted in an internal blockchain: ${message.deposit_id}`)
            }
        }
    )
}

process.on('SIGINT', () => {
    messenger.disconnect()
    internalBlockchain.disconnect()
});

main()
