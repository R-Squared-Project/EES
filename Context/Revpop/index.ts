import CreateDeposit from './Application/Command/CreateDeposit/CreateDeposit'
import CreateDepositHandler from './Application/Command/CreateDeposit/CreateDepositHandler'
import TypeOrmRepository from "./Infrastructure/TypeOrmRepository";
import DataSource from "./Infrastructure/TypeORM/DataSource/DataSource";
import "./Subscribers";

const repository = new TypeOrmRepository(DataSource)
const createDepositHandler = new CreateDepositHandler(repository)

export {CreateDeposit, createDepositHandler}
