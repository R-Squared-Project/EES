import { Module } from '@nestjs/common';
import GetSettingsController from './GetSettingsController';
import SubmitDepositRequestController from "./SubmitDepositRequestController";
import CheckDepositSubmittedToInternalBlockchainController from "./CheckDepositSubmittedToInternalBlockchainController";
import TypeOrmRepository from "context/Infrastructure/TypeORM/DepositRepository";
import DataSource from "context/Infrastructure/TypeORM/DataSource/DataSource";

@Module({
    providers: [
        {
            provide: "DepositRepositoryInterface",
            useClass: TypeOrmRepository
        },
        {
            provide: "DataSource",
            useValue: DataSource
        },
    ],
    controllers: [
        GetSettingsController,
        SubmitDepositRequestController,
        CheckDepositSubmittedToInternalBlockchainController,
    ],
})
export default class WalletModule {}
