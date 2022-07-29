import StubRepository from "./Infrastructure/StubRepository";
import InitializeDeposit from "./Application/Command/InitializeDeposit/InitializeDeposit";
import InitializeDepositHandler from "./Application/Command/InitializeDeposit/InitializeDepositHandler";

const stubRepository = new StubRepository()
const initializeDepositHandler = new InitializeDepositHandler(stubRepository)

export {stubRepository, StubRepository}
export {InitializeDeposit, initializeDepositHandler, InitializeDepositHandler}