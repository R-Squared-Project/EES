import Web3 from 'web3';
import dotenv from 'dotenv'
import {AbiItem} from 'web3-utils';
import {EventData} from 'web3-eth-contract';
import HashedTimelockAbi from '../assets/abi/HashedTimelock.json'
import {CreateDeposit, createDepositHandler} from '../../Context/Eth';
import '../../Context'

dotenv.config()

const web3 = new Web3(new Web3.providers.WebsocketProvider(
    `wss://${process.env.ETH_NETWORK_NAME}.infura.io/ws/v3/${process.env.INFURA_API_KEY}`
))
const contract = new web3.eth.Contract(HashedTimelockAbi as AbiItem[], process.env.ETH_CONTRACT_ADDRESS)

contract.events.LogHTLCNew({
    fromBlock: process.env.DEPLOY_CONTRACT_BLOCK,
    topics: [process.env.ETH_CONTRACT_TOPIC_HTLC_NEW]
})
    .on('connected', function (subscriptionId: string) {
        console.log('Start watching new HTLC contracts');
    })
    .on('data', function (event: EventData) {
        console.log(`Found new contract ${event.returnValues.contractId}`);
        
        const command = new CreateDeposit(
            event.transactionHash,
            event.returnValues.contractId,
            event.returnValues.sender,
            event.returnValues.receiver,
            event.returnValues.amount,
            event.returnValues.hashlock,
            event.returnValues.timelock,
        )

        createDepositHandler.execute(command)
    })
    .on('changed', function (event: EventData) {
        // Could this happen? And when?
    })
    .on('error', function (error: any) {
        console.log('error', error);
    });

