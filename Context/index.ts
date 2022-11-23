import DataSource from "./Infrastructure/TypeORM/DataSource/DataSource";
import SubmitDepositRequest from "./Application/Command/SubmitDepositRequest/SubmitDepositRequest";
import SubmitDepositRequestHandler from "./Application/Command/SubmitDepositRequest/SubmitDepositRequestHandler";
import DepositRequestTypeOrmRepository from "./Infrastructure/TypeORM/DepositRequestTypeOrmRepository";

const repository = new DepositRequestTypeOrmRepository(DataSource)
const submitDepositRequestHandler = new SubmitDepositRequestHandler(repository)

export {SubmitDepositRequest, submitDepositRequestHandler}
