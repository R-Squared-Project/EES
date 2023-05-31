import { DataSource } from "typeorm";
import RepositoryInterface from "./Domain/RepositoryInterface";
import TypeOrmRepository from "./Infrastructure/TypeOrm/Repository";
import StubRepository from "./Infrastructure/Stub/Repository";
import { Inject, Injectable } from "@nestjs/common";
import { InvalidSettingConfigError } from "context/Setting/Errors";

export const EXTERNAL_REDEEM_ALERT_THRESHOLD_TIMEOUT = "external_redeem_alert_threshold_timeout";
export const INTERNAL_REDEEM_ALERT_THRESHOLD_TIMEOUT = "internal_redeem_alert_threshold_timeout";

interface Config {
    repository: "typeorm" | "stub";
    dataSource?: DataSource;
}

@Injectable()
export default class Setting {
    private repository: RepositoryInterface;

    constructor(@Inject("SettingConfig") private config: Config, private typeormRepository?: TypeOrmRepository) {
        if (config.repository == "typeorm") {
            if (typeormRepository) {
                this.repository = typeormRepository;
            } else if (config.dataSource) {
                this.repository = new TypeOrmRepository(config.dataSource);
            } else {
                throw new InvalidSettingConfigError();
            }
        } else {
            this.repository = new StubRepository();
        }
    }

    public static init(config: Config): Setting {
        return new Setting(config);
    }

    public async load(name: string, defaultValue?: any): Promise<string> {
        const value = await this.repository.load(name);

        return value ?? defaultValue;
    }

    public async save(name: string, value: any) {
        await this.repository.save(name, value);
    }
}
