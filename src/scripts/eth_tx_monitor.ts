import dayjs from "dayjs";
import yargs from "yargs"
import {ProcessIncomingContractCreation, processIncomingContractCreationHandler} from '../../Context';
import GetLastContracts from "context/Application/Query/ExternalBlockchain/GetLastContracts/GetLastContracts";
import GetLastContractsHandler
    from "context/Application/Query/ExternalBlockchain/GetLastContracts/GetLastContractsHandler";
import ExternalBlockchain from "context/ExternalBlockchain/ExternalBlockchain";

const argv = yargs(process.argv.slice(2))
    .option('block-number', {
        alias: 'bn',
        describe: 'Block to search',
        default: null,
        type: "number"
    })
    .help()
    .argv

//@ts-ignore
const blockNumber = argv.blockNumber

const externalBlockchain = new ExternalBlockchain('ethereum')
const getLastContractsHandler = new GetLastContractsHandler(externalBlockchain)

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

setInterval(processEvents, 10000)

