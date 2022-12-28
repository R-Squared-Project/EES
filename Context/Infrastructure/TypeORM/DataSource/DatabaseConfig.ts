import path from "path";
import {DataSourceOptions} from "typeorm/data-source/DataSourceOptions";
import Subscriber from "context/Core/Infrastructure/TypeORM/Subscriber";
import DepositEntity from "../Entity/DepositEntity";
import DepositRequestEntity from "../Entity/DepositRequestEntity";
import ExternalContractEntity from "context/Infrastructure/TypeORM/Entity/ExternalContractEntity";
import config from "../../../config";

const DatabaseConfig: DataSourceOptions = {
    type: 'mysql',
    host: config.db.host,
    port: config.db.port,
    username: config.db.user,
    password: config.db.password,
    database: config.db.name,
    entities: [DepositRequestEntity, DepositEntity, ExternalContractEntity],
    migrations: [path.join(__dirname, '..', 'migrations', '*.ts')],
    subscribers: [Subscriber],
    migrationsRun: config.isTest,
    logging: true
}

export default DatabaseConfig
