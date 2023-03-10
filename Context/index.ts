import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import DataSource from "./Infrastructure/TypeORM/DataSource/DataSource";
import DepositRequestTypeOrmRepository from "./Infrastructure/TypeORM/DepositRequestRepository";
import SubmitDepositRequest from "./Application/Command/SubmitDepositRequest/SubmitDepositRequest";
import SubmitDepositRequestHandler from "./Application/Command/SubmitDepositRequest/SubmitDepositRequestHandler";

dayjs.extend(duration)

const depositRequestRepository = new DepositRequestTypeOrmRepository(DataSource)

const submitDepositRequestHandler = new SubmitDepositRequestHandler(depositRequestRepository)

export {SubmitDepositRequest, submitDepositRequestHandler}
