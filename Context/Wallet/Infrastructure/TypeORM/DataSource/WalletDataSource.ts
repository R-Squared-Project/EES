import "reflect-metadata"
import {DataSource} from "typeorm"
import DatabaseConfig from "./DatabaseConfig";

const WalletDataSource = new DataSource(DatabaseConfig)

WalletDataSource.initialize()

export default WalletDataSource