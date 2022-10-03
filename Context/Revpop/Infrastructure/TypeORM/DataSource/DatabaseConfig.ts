import path from 'path';
import {DataSourceOptions} from 'typeorm/data-source/DataSourceOptions';
import config from "../../../config";
import DepositEntity from '../Entity/DepositEntity';
import Subscriber from '../../../../Core/Infrastructure/TypeORM/Subscriber';

const DatabaseConfig: DataSourceOptions = {
    type: 'mysql',
    host: config.db.host,
    port: config.db.port,
    username: config.db.user,
    password: config.db.password,
    database: config.db.name,
    entities: [DepositEntity],
    migrations: [path.join(__dirname, '..', 'migrations', '*.ts')],
    subscribers: [Subscriber],
    migrationsRun: config.isTest,
    logging: !config.isTest
}

export default DatabaseConfig