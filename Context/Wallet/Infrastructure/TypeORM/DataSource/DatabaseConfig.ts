import dotenv from 'dotenv'
import path from "path";
import {DataSourceOptions} from "typeorm/data-source/DataSourceOptions";
import DepositEntity from "../Entity/DepositEntity";
import Subscriber from "../../../../Core/Infrastructure/TypeORM/Subscriber";

dotenv.config()

const DatabaseConfig: DataSourceOptions = {
    type: 'mysql',
    host: process.env.WALLET_DATABASE_HOST,
    port: parseInt(process.env.WALLET_DATABASE_PORT as string, 10),
    username: process.env.WALLET_DATABASE_USER,
    password: process.env.WALLET_DATABASE_PASSWORD,
    database: process.env.WALLET_DATABASE,
    entities: [DepositEntity],
    migrations: [path.join(__dirname, '..', 'migrations', '*.ts')],
    subscribers: [Subscriber]
}

const DatabaseConfigTest: DataSourceOptions = {
    ...DatabaseConfig,
    database: process.env.WALLET_DATABASE_TEST,
    migrationsRun: true,
    logging: false
}

export default DatabaseConfig
export {DatabaseConfigTest}