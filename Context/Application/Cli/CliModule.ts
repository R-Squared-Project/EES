import {Module} from "@nestjs/common";
import DataSource from "context/Infrastructure/TypeORM/DataSource/DataSource";
import {MonitorEthereumTransactions} from "context/Application/Cli/MonitorEthereumTransactions";
import TypeOrmRepository from "context/Infrastructure/TypeORM/DepositRepository";
import DepositRequestTypeOrmRepository from "context/Infrastructure/TypeORM/DepositRequestRepository";
import ExternalBlockchain from "context/ExternalBlockchain/ExternalBlockchain";
import GetLastContractsHandler
    from "context/Application/Query/ExternalBlockchain/GetLastContractsEvents/GetLastContractsHandler";
import GetLastBlocksHandler from "context/Application/Query/ExternalBlockchain/GetLastBlocks/GetLastBlocksHandler";
import ChainProcessor from "context/Application/Command/ExternalBlockchain/ChainProcessor/ChainProcessor";
import ProcessIncomingContractCreationHandler
    from "context/Application/Command/ExternalBlockchain/ProcessIncomingContractCreation/ProcessIncomingContractCreationHandler";
import {TypeOrmModule} from "@nestjs/typeorm";
import config from "context/config";
import Setting from "context/Setting/Setting";
import SettingEntity from "context/Setting/Infrastructure/TypeOrm/Entity/SettingEntity";
import SettingRepository from "context/Setting/Infrastructure/TypeOrm/Repository";
import IncomingContractsCreationsProcessingLink
    from "context/Application/Command/ExternalBlockchain/ProcessIncomingContractCreation/IncomingContractsCreationsProcessingLink";
import RabbitMQ from "context/Queue/RabbitMQ";
import MonitorExternalContractsRedeemsLink
    from "context/Application/Command/ExternalBlockchain/MonitorExternalContractRedeem/MonitorExternalContractsRedeemsLink";
import GetLastRedeemsHandler
    from "context/Application/Query/ExternalBlockchain/GetLastContractsEvents/GetLastRedeemsHandler";
import ExternalContractRedeemHandler
    from "context/Application/Command/ExternalBlockchain/MonitorExternalContractRedeem/ExternalContractRedeemHandler";
import EthereumRepository from "context/ExternalBlockchain/Repository/EthereumRepository";
import ConsoleNotifier from "context/Notifier/ConsoleNotifier";
import {ExternalContractRedeemWorker} from "context/Application/Cli/ExternalContractRedeemWorker";
import ConfirmDepositExternalContractRedeemedHandler
    from "context/Application/Command/ExternalBlockchain/ConfirmDepositExternalContractRedeemed/ConfirmDepositExternalContractRedeemedHandler";
import {MonitorDepositInternalContractRefunded} from "context/Application/Cli/MonitorDepositInternalContractRefunded";
import DepositInternalContractRefundHandler
    from "context/Application/Command/InternalBlockchain/DepositInternalContractRefund/DepositInternalContractRefundHandler";
import InternalBlockchain from "context/InternalBlockchain/InternalBlockchain";
import EtherToWrappedEtherConverter from "context/Infrastructure/EtherToWrappedEtherConverter";
import AssetNormalizer from "context/Infrastructure/AssetNormalizer";

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: config.db.host,
            port: config.db.port,
            username: config.db.user,
            password: config.db.password,
            database: config.db.name,
            entities: [SettingEntity],
            keepConnectionAlive: true,
        }),
        TypeOrmModule.forFeature([SettingEntity]),
    ],
    providers: [
        MonitorEthereumTransactions,
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
        EtherToWrappedEtherConverter,
        AssetNormalizer,
        {
            provide: "DataSource",
            useValue: DataSource
        },
        {
            provide: "SettingConfig",
            useValue: {repository: 'typeorm'},
        },
        {
            provide: "ExternalBlockchainRepositoryName",
            useValue: "ethereum"
        },
        {
            provide: "DepositRepositoryInterface",
            useClass: TypeOrmRepository
        },
        {
            provide: "DepositRequestRepositoryInterface",
            useClass: DepositRequestTypeOrmRepository
        },
        {
            provide: "ExternalBlockchainRepositoryInterface",
            useClass: EthereumRepository
        },
        {
            provide: "InternalBlockchain",
            useFactory: () => {
                return InternalBlockchain.init({repository: "revpop"})
            }
        },
        {
            provide: "NotifierInterface",
            useClass: ConsoleNotifier
        }

    ]
})
export class CliModule {}
