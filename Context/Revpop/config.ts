import Config from "../Core/config";

const config = {
    ...Config.config(),
    db: {
        name: process.env.REVPOP_DATABASE,
        host: process.env.REVPOP_DATABASE_HOST,
        port: parseInt(process.env.REVPOP_DATABASE_PORT as string, 10),
        user: process.env.REVPOP_DATABASE_USER,
        password: process.env.REVPOP_DATABASE_PASSWORD
    }
}

export default config