import RepositoryInterface from "context/Setting/Domain/RepositoryInterface";
import {Inject, Injectable} from "@nestjs/common";
import {DataSource} from "typeorm";
import SettingEntity from "context/Setting/Infrastructure/TypeOrm/Entity/SettingEntity";
import Setting from "context/Setting/Domain/Setting";


@Injectable()
export default class SettingRepository implements RepositoryInterface
{
    constructor(
        @Inject('DataSource')
        private _datasource: DataSource
    ) {}

    async load(name: string): Promise<string | null> {
        const setting = await this._datasource.getRepository<Setting>(SettingEntity)
            .createQueryBuilder('s')
            .select('s.value')
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
            .into(SettingEntity)
            .values([
                {name, value}
            ])
            .orUpdate(['value'], ['name'])
            .execute()
    }
}