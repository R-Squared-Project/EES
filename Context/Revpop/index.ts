import CreateDeposit from './Application/Command/CreateDeposit/CreateDeposit'
import CreateDepositHandler from './Application/Command/CreateDeposit/CreateDepositHandler'
import TypeOrmRepository from "./Infrastructure/TypeOrmRepository";
import WalletDataSource from "../Wallet/Infrastructure/TypeORM/DataSource/WalletDataSource";
import "./Subscribers";

const repository = new TypeOrmRepository(WalletDataSource)
const createDepositHandler = new CreateDepositHandler(repository)

export {CreateDeposit, createDepositHandler}
