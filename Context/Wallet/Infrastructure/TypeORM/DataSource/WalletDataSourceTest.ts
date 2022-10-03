import "reflect-metadata"
import {DataSource} from "typeorm"
import DatabaseConfig from "./DatabaseConfig";

export default async function initWalletDataSourceTest(): Promise<DataSource> {
    const walletDataSourceTest = new DataSource(DatabaseConfig)
    await walletDataSourceTest.initialize()
    return walletDataSourceTest
}