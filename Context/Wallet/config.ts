import Config from "../Core/config";

const config = {
    ...Config.config(),
    db: {
        name: process.env.WALLET_DATABASE,
        host: process.env.WALLET_DATABASE_HOST,
        port: parseInt(process.env.ETH_DATABASE_PORT as string, 10),
        user: process.env.WALLET_DATABASE_USER,
        password: process.env.WALLET_DATABASE_PASSWORD
    }
}

export default config