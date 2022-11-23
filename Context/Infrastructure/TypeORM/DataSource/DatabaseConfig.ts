import path from "path";
import {DataSourceOptions} from "typeorm/data-source/DataSourceOptions";
import DepositEntity from "../Entity/DepositEntity";
import config from "../../config";

const DatabaseConfig: DataSourceOptions = {
    type: 'mysql',
    host: config.db.host,
    port: config.db.port,
    username: config.db.user,
    password: config.db.password,
    database: config.db.name,
    entities: [DepositEntity],
    migrations: [path.join(__dirname, '..', 'migrations', '*.ts')],
    subscribers: [],
    migrationsRun: config.isTest,
    logging: config.isTest
}

export default DatabaseConfig
