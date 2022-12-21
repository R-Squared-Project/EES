import Config from "context/Core/config";
import Web3 from "web3";

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
        deploy_block_number: parseInt(process.env.ETH_DEPLOY_CONTRACT_BLOCK as string, 10),
        receiver: process.env.ETH_RECEIVER as string,
        required_block_confirmations: parseInt(process.env.ETH_REQUIRED_BLOCK_CONFIRMATIONS as string, 10)
    },
    revpop: {
        node_url: process.env.REVPOP_NODE_URL,
        account_from: process.env.REVPOP_ACCOUNT_FROM,
        asset_symbol: process.env.REVPOP_ASSET_SYMBOL,
        account_private_key: process.env.REVPOP_ACCOUNT_PRIVATE_KEY
    },
    db: {
        name: process.env.DATABASE,
        host: process.env.DATABASE_HOST,
        port: parseInt(process.env.DATABASE_PORT as string, 10),
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD
    }
}

export default config
