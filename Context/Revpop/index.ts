import ConfirmDepositByUser from './Application/Command/ConfirmDepositByUser/ConfirmDepositByUser'
import ConfirmDepositByUserHandler from './Application/Command/ConfirmDepositByUser/ConfirmDepositByUserHandler'
import ConfirmDepositByBlockchain from './Application/Command/ConfirmDepositByBlockchain/ConfirmDepositByBlockchain'
import ConfirmDepositByBlockchainHandler from './Application/Command/ConfirmDepositByBlockchain/ConfirmDepositByBlockchainHandler'
import TypeOrmRepository from "./Infrastructure/TypeOrmRepository";
import DataSource from "./Infrastructure/TypeORM/DataSource/DataSource";
import "./Subscribers";

const repository = new TypeOrmRepository(DataSource)
const confirmDepositByUserHandler = new ConfirmDepositByUserHandler(repository)
const confirmDepositByBlockchainHandler = new ConfirmDepositByBlockchainHandler(repository)

export {ConfirmDepositByUser, confirmDepositByUserHandler}
export {ConfirmDepositByBlockchain, confirmDepositByBlockchainHandler}
