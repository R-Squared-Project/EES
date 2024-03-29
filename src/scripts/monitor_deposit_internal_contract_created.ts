import yargs from "yargs";
import DataSource from "context/Infrastructure/TypeORM/DataSource/DataSource";
import DepositTypeOrmRepository from "context/Infrastructure/TypeORM/DepositRepository";
import InternalBlockchain from "context/InternalBlockchain/InternalBlockchain";
import ErrorHandler from "context/Infrastructure/Errors/Handler";
import ConfirmDepositInternalContractCreated from "../../Context/Application/Command/InternalBlockchain/ConfirmDepositInternalContractCreated/ConfirmDepositInternalContractCreated";
import ConfirmDepositInternalContractCreatedHandler from "../../Context/Application/Command/InternalBlockchain/ConfirmDepositInternalContractCreated/ConfirmDepositInternalContractCreatedHandler";
import Setting from "context/Setting/Setting";
import GetLastDepositContractsHandler from "context/Application/Query/InternalBlockchain/GetLastDepositContracts/GetLastDepositContractsHandler";
import GetLastDepositContracts from "context/Application/Query/InternalBlockchain/GetLastDepositContracts/GetLastDepositContracts";
import config from "context/config";

const argv = yargs(process.argv.slice(2))
    .option("interval", {
        alias: "i",
        describe: "Launch interval (seconds)",
        default: config.worker.period,
        type: "number",
    })
    .help()
    .parseSync();

const interval = argv.interval;
let depositRepository: DepositTypeOrmRepository;
let internalBlockchain: InternalBlockchain;
let settings: Setting;
let getLastDepositContractsHandler: GetLastDepositContractsHandler;
let confirmDepositInternalContractCreatedHandler: ConfirmDepositInternalContractCreatedHandler;
const errorHandler = new ErrorHandler("MonitorDepositInternalContractCreated");

async function init() {
    depositRepository = new DepositTypeOrmRepository(DataSource);
    internalBlockchain = await InternalBlockchain.init({
        repository: "native",
    });
    settings = Setting.init({
        repository: "typeorm",
        dataSource: DataSource,
    });
    getLastDepositContractsHandler = new GetLastDepositContractsHandler(internalBlockchain, settings);
    confirmDepositInternalContractCreatedHandler = new ConfirmDepositInternalContractCreatedHandler(depositRepository);
}

async function main() {
    const queryGetLastDepositContracts = new GetLastDepositContracts();
    const depositInternalContracts = await getLastDepositContractsHandler.execute(queryGetLastDepositContracts);

    if (depositInternalContracts.contracts.length === 0) {
        return;
    }

    console.log(
        `MonitorDepositInternalContractCreated: Found ${depositInternalContracts.contracts.length} internal contracts to processed.`
    );

    for (const contract of depositInternalContracts.contracts) {
        const query = new ConfirmDepositInternalContractCreated(contract.message, contract.id);

        try {
            await confirmDepositInternalContractCreatedHandler.execute(query);
            console.log(`MonitorDepositInternalContractCreated: Internal contract ${contract.id} created.`);
        } catch (e) {
            errorHandler.handle(e);
        }
    }
}

init().then(() => {
    setInterval(main, interval * 1000);
});
