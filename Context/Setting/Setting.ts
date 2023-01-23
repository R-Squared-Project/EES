import {DataSource} from "typeorm";
import RepositoryInterface from "./Domain/RepositoryInterface";
import TypeOrmRepository from "./Infrastructure/TypeOrm/Repository";
import StubRepository from "./Infrastructure/Stub/Repository";

interface Config {
    repository: 'typeorm' | 'stub',
    dataSource?: DataSource
}

export default class Setting {
    private repository: RepositoryInterface;

    constructor(config: Config) {
        if (config.repository === 'typeorm' && config.dataSource) {
            this.repository = new TypeOrmRepository(config.dataSource)
        } else {
            this.repository = new StubRepository()
        }
    }

    public static init(config: Config): Setting {
        return new Setting(config)
    }

    public async load(name: string, defaultValue?: any): Promise<string> {
        const value = await this.repository.load(name)

        return value ?? defaultValue
    }

    public async save(name: string, value: any) {
        await this.repository.save(name, value)
    }
}
