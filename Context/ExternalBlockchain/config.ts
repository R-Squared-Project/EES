import Config from "context/Core/config";
import Web3 from "web3";

type Repository = 'ethereum' | 'stub'

const config = {
    ...Config.config(),
    contract: {
        minimum_timelock: parseInt(process.env.MINUMUM_TIMELOCK as string, 10)
    },
    eth: {
        providers: {
            infura: {
                api_key: process.env.INFURA_API_KEY
            }
        },
        provider: 'infura',
        network: process.env.ETH_NETWORK_NAME as string,
        private_key: process.env.ETH_PRIVATE_KEY as string,
        minimum_deposit_amount: Web3.utils.toBN(Web3.utils.toWei(process.env.MINIMUM_DEPOSIT_AMOUNT as string)),
        contract_address: process.env.ETH_CONTRACT_ADDRESS as string,
        receiver: process.env.ETH_RECEIVER as string
    }
}

export default config
