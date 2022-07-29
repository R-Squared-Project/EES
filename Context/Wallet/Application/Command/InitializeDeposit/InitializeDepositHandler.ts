import InitializeDeposit from "./InitializeDeposit";
import RepositoryInterface from "../../../Domain/RepositoryInterface";

export default class InitializeDepositHandler {
    constructor(
        private _repository: RepositoryInterface
    ) {
    }

    execute(command: InitializeDeposit) {

    }
}