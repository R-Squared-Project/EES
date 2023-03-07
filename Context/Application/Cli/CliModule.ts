import {Module} from "@nestjs/common";
import DataSource from "context/Infrastructure/TypeORM/DataSource/DataSource";
import {MonitorEthereumTransactions} from "context/Application/Cli/MonitorEthereumTransactions";
import TypeOrmRepository from "context/Infrastructure/TypeORM/DepositRepository";
import DepositRequestTypeOrmRepository from "context/Infrastructure/TypeORM/DepositRequestRepository";
import ExternalBlockchain from "context/ExternalBlockchain/ExternalBlockchain";
import GetLastContractsHandler
    from "context/Application/Query/ExternalBlockchain/GetLastContracts/GetLastContractsHandler";
import GetLastBlocksHandler from "context/Application/Query/ExternalBlockchain/GetLastBlocks/GetLastBlocksHandler";
import ChainProcessor from "context/Application/Command/ExternalBlockchain/ChainProcessor/ChainProcessor";
import Setting from "context/Setting/Setting";
import ProcessIncomingContractCreationHandler
    from "context/Application/Command/ExternalBlockchain/ProcessIncomingContractCreation/ProcessIncomingContractCreationHandler";

@Module({
    providers: [
        MonitorEthereumTransactions,
        ExternalBlockchain,
        GetLastContractsHandler,
        GetLastBlocksHandler,
        ChainProcessor,
        Setting,
        ProcessIncomingContractCreationHandler,
        {
            provide: "DataSource",
            useValue: DataSource
        },
        {
            provide: "RepositoryName",
            useValue: "ethereum"
        },
        {
            provide: "DepositRepositoryInterface",
            useClass: TypeOrmRepository
        },
        {
            provide: "DepositRequestRepositoryInterface",
            useClass: DepositRequestTypeOrmRepository
        }

    ]
})
export class CliModule {}