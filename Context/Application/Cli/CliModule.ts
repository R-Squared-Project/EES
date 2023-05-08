import { Module } from "@nestjs/common";
import DataSource from "context/Infrastructure/TypeORM/DataSource/DataSource";
import { MonitorEthereumTransactions } from "context/Application/Cli/MonitorEthereumTransactions";
import TypeOrmRepository from "context/Infrastructure/TypeORM/DepositRepository";
import DepositRequestTypeOrmRepository from "context/Infrastructure/TypeORM/DepositRequestRepository";
import ExternalBlockchain from "context/ExternalBlockchain/ExternalBlockchain";
import GetLastContractsHandler from "context/Application/Query/ExternalBlockchain/GetLastContractsEvents/GetLastContractsHandler";
import GetLastBlocksHandler from "context/Application/Query/ExternalBlockchain/GetLastBlocks/GetLastBlocksHandler";
import ChainProcessor from "context/Application/Command/ExternalBlockchain/ChainProcessor/ChainProcessor";
import ProcessIncomingContractCreationHandler from "context/Application/Command/ExternalBlockchain/ProcessIncomingContractCreation/ProcessIncomingContractCreationHandler";
import Setting from "context/Setting/Setting";
import SettingRepository from "context/Setting/Infrastructure/TypeOrm/Repository";
import IncomingContractsCreationsProcessingLink from "context/Application/Command/ExternalBlockchain/ProcessIncomingContractCreation/IncomingContractsCreationsProcessingLink";
import RabbitMQ from "context/Queue/RabbitMQ";
import MonitorExternalContractsRedeemsLink from "context/Application/Command/ExternalBlockchain/MonitorExternalContractRedeem/MonitorExternalContractsRedeemsLink";
import GetLastRedeemsHandler from "context/Application/Query/ExternalBlockchain/GetLastContractsEvents/GetLastRedeemsHandler";
import ExternalContractRedeemHandler from "context/Application/Command/ExternalBlockchain/MonitorExternalContractRedeem/ExternalContractRedeemHandler";
import EthereumRepository from "context/ExternalBlockchain/Repository/EthereumRepository";
import ConsoleNotifier from "context/Notifier/ConsoleNotifier";
import { ExternalContractRedeemWorker } from "context/Application/Cli/ExternalContractRedeemWorker";
import ConfirmDepositExternalContractRedeemedHandler from "context/Application/Command/ExternalBlockchain/ConfirmDepositExternalContractRedeemed/ConfirmDepositExternalContractRedeemedHandler";
import { MonitorDepositInternalContractRefunded } from "context/Application/Cli/MonitorDepositInternalContractRefunded";
import DepositInternalContractRefundHandler from "context/Application/Command/InternalBlockchain/DepositInternalContractRefund/DepositInternalContractRefundHandler";
import InternalBlockchain from "context/InternalBlockchain/InternalBlockchain";
import { MonitorDepositInternalContractBurned } from "context/Application/Cli/MonitorDepositInternalContractBurned";
import BurnedHandler from "context/Application/Command/InternalBlockchain/Confirm/Burned/BurnedHandler";
import EtherToWrappedEtherConverter from "context/Infrastructure/EtherToWrappedEtherConverter";
import AssetNormalizer from "context/Infrastructure/AssetNormalizer";
import { MonitorWithdrawInternalContractCreated } from "context/Application/Cli/MonitorWithdrawInternalContractCreated";
import GetLastWithdrawContractsHandler from "context/Application/Query/InternalBlockchain/GetLastWithdrawContracts/GetLastWithdrawContractsHandler";
import ConfirmWithdrawInternalContractCreatedHandler from "context/Application/Command/InternalBlockchain/ConfirmWithdrawInternalContractCreated/ConfirmWithdrawInternalContractCreatedHandler";
import { CoreModule } from "context/Core/CoreModule";
import { FoundWithdrawInternalContractCreation } from "context/Application/Cli/FoundWithdrawInternalContractCreation";
import CheckInternalWithdrawalOperationHandler from "context/Application/Command/InternalBlockchain/CheckInternalWithdrawalOperation/CheckInternalWithdrawalOperationHandler";
import { WorkerCreateWithdrawalExternalContract } from "context/Application/Cli/WorkerCreateWithdrawalExternalContract";
import CreateWithdrawalExternalContractHandler from "context/Application/Command/ExternalBlockchain/CreateWithdrawalExternalContract/CreateWithdrawalExternalContractHandler";
import WrappedEtherToEtherConverter from "context/Infrastructure/WrappedEtherToEtherConverter";

@Module({
    imports: [CoreModule],
    providers: [
        MonitorEthereumTransactions,
        MonitorWithdrawInternalContractCreated,
        ExternalContractRedeemWorker,
        ExternalBlockchain,
        GetLastContractsHandler,
        GetLastBlocksHandler,
        ChainProcessor,
        Setting,
        SettingRepository,
        ProcessIncomingContractCreationHandler,
        IncomingContractsCreationsProcessingLink,
        MonitorExternalContractsRedeemsLink,
        GetLastRedeemsHandler,
        ExternalContractRedeemHandler,
        RabbitMQ,
        ConfirmDepositExternalContractRedeemedHandler,
        MonitorDepositInternalContractRefunded,
        DepositInternalContractRefundHandler,
        MonitorDepositInternalContractBurned,
        BurnedHandler,
        EtherToWrappedEtherConverter,
        AssetNormalizer,
        GetLastWithdrawContractsHandler,
        ConfirmWithdrawInternalContractCreatedHandler,
        FoundWithdrawInternalContractCreation,
        CheckInternalWithdrawalOperationHandler,
        WorkerCreateWithdrawalExternalContract,
        CreateWithdrawalExternalContractHandler,
        WrappedEtherToEtherConverter,
        {
            provide: "DataSource",
            useValue: DataSource,
        },
        {
            provide: "SettingConfig",
            useValue: { repository: "typeorm" },
        },
        {
            provide: "ExternalBlockchainRepositoryName",
            useValue: "ethereum",
        },
        {
            provide: "DepositRepositoryInterface",
            useClass: TypeOrmRepository,
        },
        {
            provide: "DepositRequestRepositoryInterface",
            useClass: DepositRequestTypeOrmRepository,
        },
        {
            provide: "ExternalBlockchainRepositoryInterface",
            useClass: EthereumRepository,
        },
        {
            provide: "InternalBlockchain",
            useFactory: () => {
                return InternalBlockchain.init({ repository: "revpop" });
            },
        },
        {
            provide: "NotifierInterface",
            useClass: ConsoleNotifier,
        },
        {
            provide: "ConverterInterface",
            useClass: EtherToWrappedEtherConverter,
        },
    ],
})
export class CliModule {}
