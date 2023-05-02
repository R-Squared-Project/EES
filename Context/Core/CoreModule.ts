import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import config from "context/config";
import SettingEntity from "context/Setting/Infrastructure/TypeOrm/Entity/SettingEntity";
import WithdrawRequestEntity from "context/Infrastructure/TypeORM/Entity/WithdrawRequestEntity";
import WithdrawRequestTypeOrmRepository from "context/Infrastructure/TypeORM/WithdrawRequestRepository";
import DataSource from "context/Infrastructure/TypeORM/DataSource/DataSource";

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: config.db.host,
            port: config.db.port,
            username: config.db.user,
            password: config.db.password,
            database: config.db.name,
            entities: [SettingEntity, WithdrawRequestEntity],
            keepConnectionAlive: true,
        }),
        TypeOrmModule.forFeature([SettingEntity, WithdrawRequestEntity]),
    ],
    providers: [
        {
            provide: "WithdrawRequestRepositoryInterface",
            useClass: WithdrawRequestTypeOrmRepository
        },
        {
            provide: "DataSource",
            useValue: DataSource
        },
    ],
    exports: [
        "WithdrawRequestRepositoryInterface",
        TypeOrmModule
    ]
})
export class CoreModule {}
