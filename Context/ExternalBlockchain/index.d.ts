type Repository = 'ethereum' | 'stub'

interface Config {
    repository: Repository,
    contract: {
        minimum_timelock: number
    },
    eth?: {
        providers: {
            infura: {
                api_key: process.env.INFURA_API_KEY
            }
        },
        provider: 'infura',
        network: string,
        private_key: string,
        minimum_deposit_amount: BN,
        contract_address: string,
        receiver: string
    },
}
