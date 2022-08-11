import "reflect-metadata"
import {DataSource} from "typeorm"
import DatabaseConfig from "./DatabaseConfig";

const RevpopDataSource = new DataSource(DatabaseConfig)

RevpopDataSource.initialize()

export default RevpopDataSource