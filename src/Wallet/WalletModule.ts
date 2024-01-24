import { Module } from "@nestjs/common";
import GetSettingsController from "./GetSettingsController";
import SubmitDepositRequestController from "./SubmitDepositRequestController";
import CheckDepositSubmittedToInternalBlockchainController from "./CheckDepositSubmittedToInternalBlockchainController";
import TypeOrmRepository from "context/Infrastructure/TypeORM/DepositRepository";
import DataSource from "context/Infrastructure/TypeORM/DataSource/DataSource";
import SubmitWithdrawRequestHandler from "context/Application/Command/SubmitWithdrawRequest/SubmitWithdrawRequestHandler";
import { CoreModule } from "context/Core/CoreModule";
import SubmitWithdrawRequestController from "./SubmitWithdrawRequestController";
import GetWithdrawExternalContractController from "./GetWithdrawExternalContractController";
import GetDepositContractIdController from "./GetDepositContractIdController";
import GetDepositsStatusesController from "./GetDepositsStatusesController";

@Module({
    imports: [CoreModule],
    providers: [
        {
            provide: "DepositRepositoryInterface",
            useClass: TypeOrmRepository,
        },
        {
            provide: "DataSource",
            useValue: DataSource,
        },
        SubmitWithdrawRequestHandler,
    ],
    controllers: [
        GetSettingsController,
        SubmitDepositRequestController,
        SubmitWithdrawRequestController,
        CheckDepositSubmittedToInternalBlockchainController,
        GetWithdrawExternalContractController,
        GetDepositContractIdController,
        GetDepositsStatusesController,
    ],
})
export default class WalletModule {}
