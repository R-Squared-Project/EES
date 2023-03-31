import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import DataSource from "./Infrastructure/TypeORM/DataSource/DataSource";
import DepositRequestTypeOrmRepository from "./Infrastructure/TypeORM/DepositRequestRepository";
import SubmitDepositRequest from "./Application/Command/SubmitDepositRequest/SubmitDepositRequest";
import SubmitDepositRequestHandler from "./Application/Command/SubmitDepositRequest/SubmitDepositRequestHandler";
import DepositTypeOrmRepository from "context/Infrastructure/TypeORM/DepositRepository";
import CheckDepositSubmittedToInternalBlockchainRequest
    from "context/Application/Command/CheckDepositSubmittedToInternalBlockchainRequest/CheckDepositSubmittedToInternalBlockchainRequest";
import CheckDepositSubmittedToInternalBlockchainRequestHandler
    from "context/Application/Command/CheckDepositSubmittedToInternalBlockchainRequest/CheckDepositSubmittedToInternalBlockchainRequestHandler";

dayjs.extend(duration)

const depositRequestRepository = new DepositRequestTypeOrmRepository(DataSource)
const depositRepository = new DepositTypeOrmRepository(DataSource)

const submitDepositRequestHandler = new SubmitDepositRequestHandler(depositRequestRepository)
const checkDepositSubmittedToInternalBlockchainRequestHandler = new CheckDepositSubmittedToInternalBlockchainRequestHandler(depositRepository)

export {
    SubmitDepositRequest,
    submitDepositRequestHandler,
    CheckDepositSubmittedToInternalBlockchainRequest,
    checkDepositSubmittedToInternalBlockchainRequestHandler
}
