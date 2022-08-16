import dotenv from 'dotenv'
import path from 'path';
import {DataSourceOptions} from 'typeorm/data-source/DataSourceOptions';
import DepositEntity from '../Entity/DepositEntity';

dotenv.config()

const DatabaseConfig: DataSourceOptions = {
    type: 'mysql',
    host: process.env.ETH_DATABASE_HOST,
    port: parseInt(process.env.ETH_DATABASE_PORT as string, 10),
    username: process.env.ETH_DATABASE_USER,
    password: process.env.ETH_DATABASE_PASSWORD,
    database: process.env.ETH_DATABASE,
    entities: [DepositEntity],
    migrations: [path.join(__dirname, '..', 'migrations', '*.ts')]
}

const DatabaseConfigTest: DataSourceOptions = {
    ...DatabaseConfig,
    database: process.env.ETH_DATABASE_TEST,
    migrationsRun: true,
    logging: false
}

export default DatabaseConfig
export {DatabaseConfigTest}