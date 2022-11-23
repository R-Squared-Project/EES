// import '../../Context/Core/Infrastructure/TypeORM/Subscriber'

import initDataSourceTest from "../../Context/Infrastructure/TypeORM/DataSource/DataSourceTest";
import {DataSource} from "typeorm";

let dataSourceTest: DataSource

before(async () => {
    dataSourceTest = await initDataSourceTest()
})

after(() => {
    dataSourceTest.destroy()
})

afterEach(async () => {
    for (const entity of dataSourceTest.entityMetadatas) {
        const repository = await dataSourceTest.getRepository(entity.name);
        await repository.query(`-- DELETE FROM ${entity.tableName};`);
    }
})

export {dataSourceTest}
