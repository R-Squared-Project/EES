import "reflect-metadata"
import {DataSource as BaseDataSource} from "typeorm"
import DatabaseConfig from "./DatabaseConfig";

const DataSource = new BaseDataSource(DatabaseConfig)

DataSource.initialize()

export default DataSource
