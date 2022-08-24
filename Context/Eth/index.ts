import CreateDeposit from './Application/Command/CreateDeposit/CreateDeposit'
import CreateDepositHandler from './Application/Command/CreateDeposit/CreateDepositHandler'
import TypeOrmRepository from "./Infrastructure/TypeOrmRepository";
import Web3ContractRepository from "./Infrastructure/Web3ContractRepository";
import DataSource from "./Infrastructure/TypeORM/DataSource/DataSource";

const repository = new TypeOrmRepository(DataSource)
const contractRepository = new Web3ContractRepository()
const createDepositHandler = new CreateDepositHandler(repository, contractRepository)

export {CreateDeposit, createDepositHandler}
