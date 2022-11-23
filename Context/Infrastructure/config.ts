import Config from "../Core/config";

const config = {
    ...Config.config(),
    db: {
        name: process.env.DATABASE,
        host: process.env.DATABASE_HOST,
        port: parseInt(process.env.DATABASE_PORT as string, 10),
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD
    }
}

export default config
