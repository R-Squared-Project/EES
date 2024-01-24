import Config from "context/Core/config";
import Web3 from "web3";
import * as process from "process";

const config = {
    ...Config.config(),
    contract: {
        minimum_timelock: parseInt(process.env.MINUMUM_TIMELOCK as string),
        withdraw_internal_timelock: parseInt(process.env.WITHDRAW_INTERNAL_TIMELOCK as string),
        withdraw_external_timelock: parseInt(process.env.WITHDRAW_EXTERNAL_TIMELOCK as string),
    },
    worker: {
        period: parseInt(process.env.WORKER_PERIOD ?? "10"),
    },
    eth: {
        providers: {
            infura: {
                api_key: process.env.INFURA_API_KEY,
            },
        },
        provider: "infura",
        network: process.env.ETH_NETWORK_NAME as string,
        private_key: process.env.ETH_PRIVATE_KEY as string,
        minimum_deposit_amount: Web3.utils.toBN(Web3.utils.toWei(process.env.MINIMUM_DEPOSIT_AMOUNT as string)),
        minimum_withdraw_amount: parseFloat(process.env.MINIMUM_DEPOSIT_AMOUNT as string),
        deposit_contract_address: process.env.ETH_DEPOSIT_CONTRACT_ADDRESS as string,
        withdraw_contract_address: process.env.ETH_WITHDRAW_CONTRACT_ADDRESS as string,
        deploy_block_number: parseInt(process.env.ETH_DEPLOY_CONTRACT_BLOCK as string, 10),
        receiver: process.env.ETH_RECEIVER as string,
        required_block_confirmations: parseInt(process.env.ETH_REQUIRED_BLOCK_CONFIRMATIONS as string, 10),
        redeem_timeframe: parseInt(process.env.TIMEFRAME_REDEEM_EXTERNAL_BLOCKCHAIN as string, 10),
    },
    r_squared: {
        node_url: process.env.INTERNAL_NODE_URL,
        ees_account: process.env.INTERNAL_EES_ACCOUNT as string,
        asset_symbol: process.env.INTERNAL_ASSET_SYMBOL,
        asset_id: process.env.INTERNAL_ASSET_ID,
        account_private_key: process.env.INTERNAL_ACCOUNT_PRIVATE_KEY,
        redeem_timeframe: parseInt(process.env.TIMEFRAME_REDEEM_INTERNAL_BLOCKCHAIN as string, 10),
        chain_id: process.env.INTERNALP_CHAIN_ID,
        rqrx_withdrawal_fee: parseFloat(process.env.INTERNAL_RQRX_WITHDRAWAL_FEE as string),
        rqeth_withdrawal_fee: parseFloat(process.env.INTERNAL_RQETH_WITHDRAWAL_FEE as string),
        rqeth_deposit_fee: parseFloat(process.env.INTERNAL_RQETH_DEPOSIT_FEE as string),
        eth_to_rqeth_rate: parseFloat(process.env.INTERNAL_ETH_TO_RQETH_RATE ?? "1"),
        chain_network_name: process.env.INTERNAL_CHAIN_NETWORK_NAME as string,
        rqeth_asset_symbol: process.env.INTERNAL_RQETH_ASSET_SYMBOL as string,
    },
    db: {
        name: process.env.DATABASE,
        host: process.env.DATABASE_HOST,
        port: parseInt(process.env.DATABASE_PORT as string, 10),
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
    },
    rabbitmq: {
        host: process.env.RABBITMQ_HOST as string,
        port: parseInt(process.env.RABBITMQ_PORT as string, 10),
    },
};
export default config;
