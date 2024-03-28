import { Module } from "@nestjs/common";
import DataSource from "context/Infrastructure/TypeORM/DataSource/DataSource";
import { MonitorEthereumTransactions } from "context/Application/Cli/MonitorEthereumTransactions";
import TypeOrmRepository from "context/Infrastructure/TypeORM/DepositRepository";
import DepositRequestTypeOrmRepository from "context/Infrastructure/TypeORM/DepositRequestRepository";
import ExternalBlockchain from "context/ExternalBlockchain/ExternalBlockchain";
import GetLastBlocksHandler from "context/Application/Query/ExternalBlockchain/GetLastBlocks/GetLastBlocksHandler";
import ChainProcessor from "context/Application/Command/ExternalBlockchain/ChainProcessor/ChainProcessor";
import ProcessIncomingContractCreationHandler from "context/Application/Command/ExternalBlockchain/ProcessIncomingContractCreation/ProcessIncomingContractCreationHandler";
import Setting from "context/Setting/Setting";
import SettingRepository from "context/Setting/Infrastructure/TypeOrm/Repository";
import IncomingContractsCreationsProcessingLink from "context/Application/Command/ExternalBlockchain/ProcessIncomingContractCreation/IncomingContractsCreationsProcessingLink";
import RabbitMQ from "context/Queue/RabbitMQ";
import MonitorExternalDepositRedeemsLink from "context/Application/Command/ExternalBlockchain/MonitorExternalDepositRedeem/MonitorExternalDepositRedeemsLink";
import ExternalDepositRedeemHandler from "context/Application/Command/ExternalBlockchain/MonitorExternalDepositRedeem/ExternalDepositRedeemHandler";
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
import WithdrawContractsCreationsProcessingLink from "context/Application/Command/ExternalBlockchain/ProcessWithdrawContractCreation/WithdrawContractsCreationsProcessingLink";
import ProcessWithdrawContractCreationHandler from "context/Application/Command/ExternalBlockchain/ProcessWithdrawContractCreation/ProcessWithdrawContractCreationHandler";
import GetDepositLastContractsHandler from "context/Application/Query/ExternalBlockchain/GetDepositLastContractsEvents/GetDepositLastContractsHandler";
import GetDepositLastRedeemsHandler from "context/Application/Query/ExternalBlockchain/GetDepositLastContractsEvents/GetDepositLastRedeemsHandler";
import GetWithdrawLastContractsHandler from "context/Application/Query/ExternalBlockchain/GetWithdrawLastContractsEvents/GetWithdrawLastContractsHandler";
import GetWithdrawLastRedeemsHandler from "context/Application/Query/ExternalBlockchain/GetWithdrawLastContractsEvents/GetWithdrawLastRedeemsHandler";
import MonitorExternalWithdrawRedeemsLink from "context/Application/Command/ExternalBlockchain/MonitorExternalWithdrawRedeem/MonitorExternalWithdrawRedeemsLink";
import ExternalWithdrawRedeemHandler from "context/Application/Command/ExternalBlockchain/MonitorExternalWithdrawRedeem/ExternalWithdrawRedeemHandler";
import { WorkerWithdrawExternalContractRedeemed } from "context/Application/Cli/WorkerWithdrawExternalContractRedeemed";
import ConfirmWithdrawExternalContractRedeemedHandler from "context/Application/Command/ExternalBlockchain/ConfirmWithdrawExternalContractRedeemed/ConfirmWithdrawExternalContractRedeemedHandler";
import { ExecuteWithdrawInternalContractRedeem } from "context/Application/Cli/ExecuteWithdrawInternalContractRedeem";
import ProcessWithdrawInternalContractRedeemHandler from "context/Application/Command/InternalBlockchain/ProcessWithdrawInternalContractRedeem/ProcessWithdrawInternalContractRedeemHandler";
import { MonitorWithdrawInternalContractRedeem } from "context/Application/Cli/MonitorWithdrawInternalContractRedeem";
import ConfirmWithdrawInternalContractRedeemHandler from "context/Application/Command/InternalBlockchain/ConfirmWithdrawInternalContractRedeem/ConfirmWithdrawInternalContractRedeemHandler";
import { MonitorWithdrawInternalContractRedeemProcessed } from "context/Application/Cli/MonitorWithdrawInternalContractRedeemProcessed";
import ConfirmWithdrawProcessedHandler from "context/Application/Command/InternalBlockchain/ConfirmWithdrawProcessed/ConfirmWithdrawProcessedHandler";
import { MonitorExternalWithdrawContractTimelock } from "context/Application/Cli/MonitorExternalWithdrawContractTimelock";
import { ProcessWithdrawExternalContractRefundHandler } from "context/Application/Command/ExternalBlockchain/ProcessWithdrawExternalContractRefund/ProcessWithdrawExternalContractRefundHandler";
import {UpdateSanctionedAddresses} from "context/Application/Cli/UpdateSanctionedAddresses";
import {GetFee} from "context/Application/Cli/GetFee";
import {SetFee} from "context/Application/Cli/SetFee";
import ExternalDepositRefundHandler
    from "context/Application/Command/ExternalBlockchain/MonitorExternalDepositRefund/ExternalDepositRefundHandler";
import MonitorExternalDepositRefundsLink
    from "context/Application/Command/ExternalBlockchain/MonitorExternalDepositRefund/MonitorExternalDepositRefundsLink";
import MonitorExternalWithdrawRefundsLink
    from "context/Application/Command/ExternalBlockchain/MonitorExternalWithdrawRefund/MonitorExternalWithdrawRefundsLink";
import ExternalWithdrawRefundHandler
    from "context/Application/Command/ExternalBlockchain/MonitorExternalWithdrawRefund/ExternalWithdrawRefundHandler";
import GetDepositLastRefundsHandler
    from "context/Application/Query/ExternalBlockchain/GetDepositLastContractsEvents/GetDepositLastRefundsHandler";
import GetWithdrawLastRefundsHandler
    from "context/Application/Query/ExternalBlockchain/GetWithdrawLastContractsEvents/GetWithdrawLastRefundsHandler";
import ExecuteRefundedWithdrawInternalContractBurnHandler
    from "context/Application/Command/InternalBlockchain/ExecuteRefundedWithdrawInternalContractBurn/ExecuteRefundedWithdrawInternalContractBurnHandler";
import ExecuteRefundedWithdrawInternalContractBurn
    from "context/Application/Command/InternalBlockchain/ExecuteRefundedWithdrawInternalContractBurn/ExecuteRefundedWithdrawInternalContractBurn";
import {ExecuteWithdrawInternalContractRefund} from "context/Application/Cli/ExecuteWithdrawInternalContractRefund";

const LOG_PREFIX = new Date().getFullYear() + '-' + new Date().getMonth() + '-' + new Date().getDate() +  ' ' + new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds();
const log = console.log;

console.log = function(){

    // 1. Convert args to a normal array
    var args = Array.from(arguments);
    // OR you can use: Array.prototype.slice.call( arguments );

    // 2. Prepend log prefix log string
    args[0] = LOG_PREFIX + " - " + args[0];

    // 3. Pass along arguments to console.log
    log.apply(console, args);
}


@Module({
    imports: [CoreModule],
    providers: [
        MonitorEthereumTransactions,
        MonitorWithdrawInternalContractCreated,
        ExternalContractRedeemWorker,
        ExternalBlockchain,
        GetDepositLastContractsHandler,
        GetLastBlocksHandler,
        ChainProcessor,
        Setting,
        SettingRepository,
        ProcessIncomingContractCreationHandler,
        IncomingContractsCreationsProcessingLink,
        MonitorExternalDepositRedeemsLink,
        MonitorExternalWithdrawRedeemsLink,
        GetDepositLastRedeemsHandler,
        ExternalDepositRedeemHandler,
        ExternalWithdrawRedeemHandler,
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
        WithdrawContractsCreationsProcessingLink,
        ProcessWithdrawContractCreationHandler,
        GetWithdrawLastContractsHandler,
        GetWithdrawLastRedeemsHandler,
        WorkerWithdrawExternalContractRedeemed,
        ConfirmWithdrawExternalContractRedeemedHandler,
        ExecuteWithdrawInternalContractRedeem,
        ProcessWithdrawInternalContractRedeemHandler,
        MonitorWithdrawInternalContractRedeem,
        ConfirmWithdrawInternalContractRedeemHandler,
        MonitorWithdrawInternalContractRedeemProcessed,
        ConfirmWithdrawProcessedHandler,
        MonitorExternalWithdrawContractTimelock,
        ProcessWithdrawExternalContractRefundHandler,
        ExecuteWithdrawInternalContractRefund,
        ExecuteRefundedWithdrawInternalContractBurnHandler,
        UpdateSanctionedAddresses,
        ExternalDepositRefundHandler,
        MonitorExternalDepositRefundsLink,
        ExternalWithdrawRefundHandler,
        MonitorExternalWithdrawRefundsLink,
        GetDepositLastRefundsHandler,
        GetWithdrawLastRefundsHandler,
        GetFee,
        SetFee,
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
                return InternalBlockchain.init({ repository: "native" });
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
        {
            provide: "QueueInterface",
            useClass: RabbitMQ,
        },
    ],
})
export class CliModule {}
