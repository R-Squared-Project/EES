import path from "path";
import {DataSourceOptions} from "typeorm/data-source/DataSourceOptions";
import Subscriber from "context/Core/Infrastructure/TypeORM/Subscriber";
import DepositEntity from "../Entity/DepositEntity";
import DepositRequestEntity from "../Entity/DepositRequestEntity";
import ExternalContractEntity from "context/Infrastructure/TypeORM/Entity/ExternalContractEntity";
import SettingEntity from "context/Setting/Infrastructure/TypeOrm/Entity/SettingEntity";
import config from "../../../config";
import InternalContractEntity from "context/Infrastructure/TypeORM/Entity/InternalContractEntity";
import WithdrawRequestEntity from "context/Infrastructure/TypeORM/Entity/WithdrawRequestEntity";

const DatabaseConfig: DataSourceOptions = {
    type: 'mysql',
    host: config.db.host,
    port: config.db.port,
    username: config.db.user,
    password: config.db.password,
    database: config.db.name,
    entities: [DepositRequestEntity, DepositEntity, ExternalContractEntity, InternalContractEntity, SettingEntity, WithdrawRequestEntity],
    migrations: [path.join(__dirname, '..', 'migrations', '*.ts')],
    subscribers: [Subscriber],
    migrationsRun: config.isTest,
    logging: false
}

export default DatabaseConfig
