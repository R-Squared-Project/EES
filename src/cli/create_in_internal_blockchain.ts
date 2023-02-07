import yargs from "yargs";
import CreateContractInInternalBlockchain
    from "context/Application/Command/InternalBlockchain/CreateContractInRevpop/CreateContractInInternalBlockchain";
import DepositTypeOrmRepository from "context/Infrastructure/TypeORM/DepositRepository";
import DataSource from "context/Infrastructure/TypeORM/DataSource/DataSource";
import InternalBlockchain from "context/InternalBlockchain/InternalBlockchain";
import EtherToWrappedEtherConverter from "context/Infrastructure/EtherToWrappedEtherConverter";
import CreateContractInInternalBlockchainHandler
    from "context/Application/Command/InternalBlockchain/CreateContractInRevpop/CreateContractInInternalBlockchainHandler";

const argv = yargs(process.argv.slice(2))
    .option('id', {
        alias: 'i',
        describe: 'Deposit id',
        type: 'string'
    })
    .demandOption(['id'])
    .help()
    .parseSync()

const depositId = argv.id

const main = async () => {
    const depositRepository = new DepositTypeOrmRepository(DataSource)
    const internalBlockchain = await InternalBlockchain.init({
        repository: 'revpop'
    })
    const converter = new EtherToWrappedEtherConverter()
    const handler = new CreateContractInInternalBlockchainHandler(depositRepository, internalBlockchain, converter)

    const command = new CreateContractInInternalBlockchain(depositId)
    await handler.execute(command)

    internalBlockchain.disconnect()
}

main().then(() => {
    console.log(`Internal HTLC for deposit ${depositId} was created.`)
})
