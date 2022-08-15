import "reflect-metadata"
import {DataSource} from "typeorm"
import {DatabaseConfigTest} from "./DatabaseConfig";

export default async function initDataSourceTest(): Promise<DataSource> {
    const walletDataSourceTest = new DataSource(DatabaseConfigTest)
    await walletDataSourceTest.initialize()
    return walletDataSourceTest
}