import Config from "../Core/config";

const config = {
    ...Config.config(),
    contract: {
        minimum_timelock: parseInt(process.env.MINUMUM_TIMELOCK as string, 10)
    },
    eth: {
        provider: process.env.ETH_PROVIDER as string,
        network: process.env.ETH_NETWORK_NAME as string,
        private_key: process.env.ETH_PRIVATE_KEY as string,
        minimum_deposit_amount: process.env.MINIMUM_DEPOSIT_AMOUNT as string,
        contract_address: process.env.ETH_CONTRACT_ADDRESS as string,
        receiver: process.env.ETH_RECEIVER as string,
        block_confirmation_number: process.env.ETH_BLOCK_CONFIRMATION_NUMBER as string
    },
    eth_provider: {
        infura: {
            api_key: process.env.INFURA_API_KEY
        }
    },
    db: {
        name: process.env.ETH_DATABASE,
        host: process.env.ETH_DATABASE_HOST,
        port: parseInt(process.env.ETH_DATABASE_PORT as string, 10),
        user: process.env.ETH_DATABASE_USER,
        password: process.env.ETH_DATABASE_PASSWORD
    },
}

export default config