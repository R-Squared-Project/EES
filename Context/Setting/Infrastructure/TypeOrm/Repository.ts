import {DataSource} from "typeorm";
import RepositoryInterface from "../../Domain/RepositoryInterface";
import Setting from "../../Domain/Setting";

export default class Repository implements RepositoryInterface{
    constructor(
        private _datasource: DataSource
    ) {}

    async load(name: string): Promise<string | null> {
        const setting = await this._datasource.createQueryBuilder()
            .select('s.value')
            .from(Setting, 's')
            .where('s.name = :name', {name})
            .getOne()

        if (!setting) {
            return null
        }

        return setting.value
    }

    async save(name: string, value: any): Promise<void> {
        await this._datasource.createQueryBuilder()
            .insert()
            .into(Setting)
            .values([
                {name, value}
            ])
            .orUpdate(['value'], ['name'])
            .execute()
    }
}
