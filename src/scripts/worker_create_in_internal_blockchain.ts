import InternalBlockchain from "context/InternalBlockchain/InternalBlockchain";
import CreateContractInInternalBlockchainHandler
    from "context/Application/Command/InternalBlockchain/CreateContractInRevpop/CreateContractInInternalBlockchainHandler";
import TypeOrmRepository from "context/Infrastructure/TypeORM/TypeOrmRepository";
import DataSource from "context/Infrastructure/TypeORM/DataSource/DataSource";
import CreateContractInInternalBlockchain
    from "context/Application/Command/InternalBlockchain/CreateContractInRevpop/CreateContractInInternalBlockchain";
import Converter from "context/Infrastructure/Converter";

const depositRepository = new TypeOrmRepository(DataSource)
const internalRepository = InternalBlockchain.init({
    repository: 'revpop'
})
const converter = new Converter()
const getLastContractsHandler = new CreateContractInInternalBlockchainHandler(depositRepository, internalRepository, converter)

const query = new CreateContractInInternalBlockchain('deposit_id')
getLastContractsHandler.execute(query)
