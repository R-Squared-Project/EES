import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import DataSource from "./Infrastructure/TypeORM/DataSource/DataSource";
import TypeOrmRepository from "context/Infrastructure/TypeORM/TypeOrmRepository";
import DepositRequestTypeOrmRepository from "./Infrastructure/TypeORM/DepositRequestTypeOrmRepository";
import SubmitDepositRequest from "./Application/Command/SubmitDepositRequest/SubmitDepositRequest";
import SubmitDepositRequestHandler from "./Application/Command/SubmitDepositRequest/SubmitDepositRequestHandler";
import ProcessIncomingContractCreation
    from "context/Application/Command/ExternalBlockchain/ProcessIncomingContractCreation/ProcessIncomingContractCreation";
import ProcessIncomingContractCreationHandler
    from "context/Application/Command/ExternalBlockchain/ProcessIncomingContractCreation/ProcessIncomingContractCreationHandler";
import ExternalBlockchain from "context/ExternalBlockchain/ExternalBlockchain";

dayjs.extend(duration)

const depositRepository = new TypeOrmRepository(DataSource)
const depositRequestRepository = new DepositRequestTypeOrmRepository(DataSource)
const externalBlockchain = new ExternalBlockchain('ethereum')

const submitDepositRequestHandler = new SubmitDepositRequestHandler(depositRequestRepository)
const processIncomingContractCreationHandler = new ProcessIncomingContractCreationHandler(depositRepository,
    depositRequestRepository, externalBlockchain)

export {SubmitDepositRequest, submitDepositRequestHandler}
export {ProcessIncomingContractCreation, processIncomingContractCreationHandler}
