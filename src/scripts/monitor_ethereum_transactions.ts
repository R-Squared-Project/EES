import dayjs from 'dayjs';
import yargs from 'yargs'
import {ProcessIncomingContractCreation, processIncomingContractCreationHandler} from '../../Context';
import GetLastContracts from 'context/Application/Query/ExternalBlockchain/GetLastContracts/GetLastContracts';
import GetLastContractsHandler
    from 'context/Application/Query/ExternalBlockchain/GetLastContracts/GetLastContractsHandler';
import ExternalBlockchain from 'context/ExternalBlockchain/ExternalBlockchain';
import Setting from 'context/Setting/Setting';
import DataSource from 'context/Infrastructure/TypeORM/DataSource/DataSource';
import {AfterIncomingContractProcessed} from "context/Subscribers/AfterIncomingContractProcessed";

const argv = yargs(process.argv.slice(2))
    .option('block-number', {
        alias: 'b',
        describe: 'Block to search',
        default: null,
        type: 'number'
    })
    .option('interval', {
        alias: 'i',
        describe: 'Launch interval (seconds)',
        default: 10,
        type: 'number'
    })
    .help()
    .parseSync()

const blockNumber = argv.blockNumber
const interval = argv.interval

new AfterIncomingContractProcessed()
const externalBlockchain = new ExternalBlockchain('ethereum')
const setting = Setting.init({
    repository: 'typeorm',
    dataSource: DataSource
})

const getLastContractsHandler = new GetLastContractsHandler(externalBlockchain, setting)

const processEvents = async () => {
    const query = new GetLastContracts(blockNumber);
    const result = await getLastContractsHandler.execute(query)

    console.log(`LogHTLCNew: ${dayjs().format()}. From ${result.fromBlock} to ${result.toBlock} blocks`);
    console.log(`Found ${result.events.length} new events`);

    for (const event of result.events) {
        console.log(`Process transaction ${event.transactionHash}`)

        const command = new ProcessIncomingContractCreation(
            event.transactionHash,
            event.returnValues.contractId
        )

        try {
            await processIncomingContractCreationHandler.execute(command)
        } catch (error: any) {
            console.log(`Error while processed transaction ${event.transactionHash}: `, error.message)
            continue
        }

        console.log(`Successfully added new transaction ${event.transactionHash}. `)
    }
}

console.log(`Run event tracking at ${interval} second intervals`);

if (!blockNumber) {
    setInterval(processEvents, interval * 1000)
} else {
    processEvents().then(() => {
        process.exit()
    })
}
