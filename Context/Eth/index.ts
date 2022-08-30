import DataSource from "./Infrastructure/TypeORM/DataSource/DataSource";
import TypeOrmRepository from "./Infrastructure/TypeOrmRepository";
import Web3ContractRepository from "./Infrastructure/Web3ContractRepository";
import CreateDeposit from './Application/Command/CreateDeposit/CreateDeposit'
import CreateDepositHandler from './Application/Command/CreateDeposit/CreateDepositHandler'
import RedeemDeposit from "./Application/Command/RedeemDeposit/RedeemDeposit";
import RedeemDepositHandler from "./Application/Command/RedeemDeposit/RedeemDepositHandler";

const repository = new TypeOrmRepository(DataSource)
const contractRepository = new Web3ContractRepository(
    process.env.ETH_RECEIVER as string,
    process.env.ETH_PRIVATE_KEY as string
)
const createDepositHandler = new CreateDepositHandler(repository, contractRepository)
const redeemDepositHandler = new RedeemDepositHandler(repository, contractRepository)

export {CreateDeposit, createDepositHandler}
export {RedeemDeposit, redeemDepositHandler}
