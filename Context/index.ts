import DataSource from "./Infrastructure/TypeORM/DataSource/DataSource";
import CreateDeposit from "./Application/Command/CreateDeposit/CreateDeposit";
import CreateDepositHandler from "./Application/Command/CreateDeposit/CreateDepositHandler";
import TypeOrmRepository from "./Infrastructure/TypeORM/TypeOrmRepository";

const repository = new TypeOrmRepository(DataSource)
const createDepositHandler = new CreateDepositHandler(repository)

export {CreateDeposit, createDepositHandler}
