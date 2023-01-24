import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import DataSource from "./Infrastructure/TypeORM/DataSource/DataSource";
import DepositTypeOrmRepository from "context/Infrastructure/TypeORM/DepositRepository";
import DepositRequestTypeOrmRepository from "./Infrastructure/TypeORM/DepositRequestRepository";
import SubmitDepositRequest from "./Application/Command/SubmitDepositRequest/SubmitDepositRequest";
import SubmitDepositRequestHandler from "./Application/Command/SubmitDepositRequest/SubmitDepositRequestHandler";
import ProcessIncomingContractCreation
    from "context/Application/Command/ExternalBlockchain/ProcessIncomingContractCreation/ProcessIncomingContractCreation";
import ProcessIncomingContractCreationHandler
    from "context/Application/Command/ExternalBlockchain/ProcessIncomingContractCreation/ProcessIncomingContractCreationHandler";
import ExternalBlockchain from "context/ExternalBlockchain/ExternalBlockchain";

dayjs.extend(duration)

const depositRepository = new DepositTypeOrmRepository(DataSource)
const depositRequestRepository = new DepositRequestTypeOrmRepository(DataSource)
const externalBlockchain = new ExternalBlockchain('ethereum')

const submitDepositRequestHandler = new SubmitDepositRequestHandler(depositRequestRepository)
const processIncomingContractCreationHandler = new ProcessIncomingContractCreationHandler(depositRepository,
    depositRequestRepository, externalBlockchain)

export {SubmitDepositRequest, submitDepositRequestHandler}
export {ProcessIncomingContractCreation, processIncomingContractCreationHandler}
