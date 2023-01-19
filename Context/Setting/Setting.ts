import {DataSource} from "typeorm";
import RepositoryInterface from "./Infrastructure/Repository/RepositoryInterface";
import TypeOrmRepository from "./Infrastructure/Repository/TypeOrmRepository";

interface Config {
    repository: 'typeorm',
    dataSource: DataSource
}

export default class Setting {
    private repository: RepositoryInterface;

    constructor(config: Config) {
        this.repository = new TypeOrmRepository(config.dataSource)
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
