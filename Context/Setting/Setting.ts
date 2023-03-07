import {DataSource} from "typeorm";
import RepositoryInterface from "./Domain/RepositoryInterface";
import TypeOrmRepository from "./Infrastructure/TypeOrm/Repository";
import StubRepository from "./Infrastructure/Stub/Repository";
import {Inject, Injectable} from "@nestjs/common";

interface Config {
    repository: 'typeorm' | 'stub',
    dataSource?: DataSource
}

@Injectable()
export default class Setting {
    private repository: RepositoryInterface;

    constructor(@Inject("DataSource") private dataSource?: DataSource) {
        if (this.dataSource) {
            this.repository = new TypeOrmRepository(this.dataSource)
        } else {
            this.repository = new StubRepository()
        }
    }

    public static init(config: Config): Setting {
        return new Setting(config.dataSource)
    }

    public async load(name: string, defaultValue?: any): Promise<string> {
        const value = await this.repository.load(name)

        return value ?? defaultValue
    }

    public async save(name: string, value: any) {
        await this.repository.save(name, value)
    }
}
