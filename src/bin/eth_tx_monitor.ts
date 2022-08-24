import Web3 from 'web3';
import dayjs from "dayjs";
import dotenv from 'dotenv'
import {AbiItem} from 'web3-utils';
import HashedTimelockAbi from '../assets/abi/HashedTimelock.json'
import {CreateDeposit, createDepositHandler} from '../../Context/Eth';
import '../../Context'

dotenv.config()

const fromBlock = process.env.DEPLOY_CONTRACT_BLOCK

const web3 = new Web3(new Web3.providers.HttpProvider(
    `https://${process.env.ETH_NETWORK_NAME}.infura.io/v3/${process.env.INFURA_API_KEY}`
))
const contract = new web3.eth.Contract(HashedTimelockAbi as AbiItem[], process.env.ETH_CONTRACT_ADDRESS)

const processEvents = async () => {
    const toBlock = (await web3.eth.getBlockNumber()) - parseInt(process.env.ETH_BLOCK_CONFIRMATION_NUMBER as string, 10)

    const events = await contract.getPastEvents(
        'LogHTLCNew',
        {
            fromBlock: 12806721,
            toBlock
        }
    )

    console.log(`LogHTLCNew: ${dayjs().format()}. From ${fromBlock} to ${toBlock} blocks`);
    console.log(`Found ${events.length} new events`);

    for (const event of events) {
        console.log(`Process transaction ${event.transactionHash}`)
        const command = new CreateDeposit(
            event.transactionHash,
            event.returnValues.contractId
        )

        const result = await createDepositHandler.execute(command)

        if (result.isLeft()) {
            console.log(`Error while processed transaction ${event.transactionHash}: `, result.value.error?.message)
            continue
        }

        console.log(`Successfully added new transaction ${event.transactionHash}. `)
    }
}

processEvents().then(() => {
    console.log('LogHTLCNew: Finished');
    process.exit()
})

