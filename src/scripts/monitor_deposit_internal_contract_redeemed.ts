import yargs from "yargs";
import DataSource from "context/Infrastructure/TypeORM/DataSource/DataSource";
import DepositRepository from "context/Infrastructure/TypeORM/DepositRepository";
import InternalBlockchain from "context/InternalBlockchain/InternalBlockchain";
import ErrorHandler from "context/Infrastructure/Errors/Handler";
import AfterIncomingContractRedeemed from "context/Subscribers/AfterIncomingContractRedeemed";
import ConfirmDepositInternalContractRedeemed
    from "context/Application/Command/InternalBlockchain/ConfirmDepositInternalContractRedeemed/ConfirmDepositInternalContractRedeemed";
import ConfirmDepositInternalContractRedeemedHandler
    from "context/Application/Command/InternalBlockchain/ConfirmDepositInternalContractRedeemed/ConfirmDepositInternalContractRedeemedHandler";

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
new AfterIncomingContractRedeemed()
let depositRepository: DepositRepository
let internalBlockchain: InternalBlockchain
let confirmDepositInternalContractRedeemedHandler: ConfirmDepositInternalContractRedeemedHandler
const errorHandler = new ErrorHandler('MonitorDepositInternalContractRedeemed');

async function init() {
    depositRepository = new DepositRepository(DataSource)
    internalBlockchain = await InternalBlockchain.init({
        repository: 'revpop'
    })
    confirmDepositInternalContractRedeemedHandler = new ConfirmDepositInternalContractRedeemedHandler(depositRepository, internalBlockchain)
}

async function main() {
    const deposits = await depositRepository.getWaitingToRedeem()

    for (const deposit of deposits) {
        const command = new ConfirmDepositInternalContractRedeemed(deposit.idString)
        try {
            await confirmDepositInternalContractRedeemedHandler.execute(command)
        } catch (e) {
            errorHandler.handle(e)
        }
    }
}

init().then(() => {
    setInterval(main, interval * 1000)
})
