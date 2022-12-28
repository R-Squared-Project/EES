import yargs from "yargs";
import DataSource from "context/Infrastructure/TypeORM/DataSource/DataSource";
import TypeOrmRepository from "context/Infrastructure/TypeORM/TypeOrmRepository";
import InternalBlockchain from "context/InternalBlockchain/InternalBlockchain";
import ConfirmDepositInternalContractCreated
    from "../../Context/Application/Command/InternalBlockchain/ConfirmDepositInternalContractCreatedHandler/ConfirmDepositInternalContractCreated";
import ConfirmDepositInternalContractCreatedHandler
    from "../../Context/Application/Command/InternalBlockchain/ConfirmDepositInternalContractCreatedHandler/ConfirmDepositInternalContractCreatedHandler";

const argv = yargs(process.argv.slice(2))
    .option('interval', {
        alias: 'i',
        describe: 'Launch interval (seconds)',
        default: 10,
        type: 'number'
    })
    .help()
    .parseSync()

const interval = argv.interval
let depositRepository: TypeOrmRepository
let internalBlockchain: InternalBlockchain
let confirmDepositInternalContractCreatedHandler: ConfirmDepositInternalContractCreatedHandler

async function init() {
    depositRepository = new TypeOrmRepository(DataSource)
    internalBlockchain = await InternalBlockchain.init({
        repository: 'revpop'
    })
    confirmDepositInternalContractCreatedHandler = new ConfirmDepositInternalContractCreatedHandler(depositRepository, internalBlockchain)
}

async function main() {
    const query = new ConfirmDepositInternalContractCreated()
    await confirmDepositInternalContractCreatedHandler.execute(query)
}

init().then(() => {
    setInterval(main, interval * 1000)
})
