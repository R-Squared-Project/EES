import initDataSourceTest from "../../Context/Infrastructure/TypeORM/DataSource/DataSourceTest";
import {DataSource} from "typeorm";
import DepositRequest from "context/Domain/DepositRequest";
import Deposit from "context/Domain/Deposit";
import ExternalContract from "context/Domain/ExternalContract";
import InternalContract from "context/Domain/InternalContract";

let dataSourceTest: DataSource

export const mochaHooks = {
    beforeAll: async () => {
        dataSourceTest = await initDataSourceTest()
    },
    afterAll: async () => {
        await dataSourceTest.destroy()
    },
    afterEach: async () => {
        const entities = [Deposit, DepositRequest, ExternalContract, InternalContract]
        for (const entity of entities) {
            const metadata = dataSourceTest.getMetadata(entity)
            const repository = await dataSourceTest.getRepository(entity.name);
            await repository.query(`DELETE FROM ${metadata.tableName};`);
        }
    }
};

export {dataSourceTest}