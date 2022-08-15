import CreateDeposit from './Application/Command/CreateDeposit/CreateDeposit'
import CreateDepositHandler from './Application/Command/CreateDeposit/CreateDepositHandler'
import ConfirmDeposit from './Application/Command/ConfirmDeposit/ConfirmDeposit'
import ConfirmDepositHandler from './Application/Command/ConfirmDeposit/ConfirmDepositHandler'
import TypeOrmRepository from "./Infrastructure/TypeOrmRepository";
import DataSource from "./Infrastructure/TypeORM/DataSource/DataSource";
import "./Subscribers";

const repository = new TypeOrmRepository(DataSource)
const createDepositHandler = new CreateDepositHandler(repository)
const confirmDepositHandler = new ConfirmDepositHandler(repository)

export {CreateDeposit, createDepositHandler}
export {ConfirmDeposit, confirmDepositHandler}
