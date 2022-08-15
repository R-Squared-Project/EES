import dotenv from 'dotenv'
import path from 'path';
import {DataSourceOptions} from 'typeorm/data-source/DataSourceOptions';
import DepositEntity from '../Entity/DepositEntity';
import Subscriber from '../../../../Core/Infrastructure/TypeORM/Subscriber';

dotenv.config()

const DatabaseConfig: DataSourceOptions = {
    type: 'mysql',
    host: process.env.REVPOP_DATABASE_HOST,
    port: parseInt(process.env.REVPOP_DATABASE_PORT as string, 10),
    username: process.env.REVPOP_DATABASE_USER,
    password: process.env.REVPOP_DATABASE_PASSWORD,
    database: process.env.REVPOP_DATABASE,
    entities: [DepositEntity],
    migrations: [path.join(__dirname, '..', 'migrations', '*.ts')],
    subscribers: [Subscriber]
}

const DatabaseConfigTest: DataSourceOptions = {
    ...DatabaseConfig,
    database: process.env.REVPOP_DATABASE_TEST,
    migrationsRun: true,
    logging: false
}

export default DatabaseConfig
export {DatabaseConfigTest}