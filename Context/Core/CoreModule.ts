import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import config from "context/config";
import WithdrawRequestTypeOrmRepository from "context/Infrastructure/TypeORM/WithdrawRequestTypeOrmRepository";
import DataSource from "context/Infrastructure/TypeORM/DataSource/DataSource";
import DatabaseConfig from "context/Infrastructure/TypeORM/DataSource/DatabaseConfig";
import { EntityClassOrSchema } from "@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type";
import WithdrawTypeOrmRepository from "context/Infrastructure/TypeORM/WithdrawTypeOrmRepository";

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: "mysql",
            host: config.db.host,
            port: config.db.port,
            username: config.db.user,
            password: config.db.password,
            database: config.db.name,
            entities: DatabaseConfig.entities,
            keepConnectionAlive: true,
        }),
        TypeOrmModule.forFeature(DatabaseConfig.entities as EntityClassOrSchema[]),
    ],
    providers: [
        {
            provide: "WithdrawRequestRepositoryInterface",
            useClass: WithdrawRequestTypeOrmRepository,
        },
        {
            provide: "WithdrawRepositoryInterface",
            useClass: WithdrawTypeOrmRepository,
        },
        {
            provide: "DataSource",
            useValue: DataSource,
        },
    ],
    exports: ["WithdrawRequestRepositoryInterface", TypeOrmModule, "WithdrawRepositoryInterface"],
})
export class CoreModule {}
