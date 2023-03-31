import {UseCase} from "context/Core/Domain/UseCase";
import CheckDepositSubmittedToInternalBlockchainRequest from "./CheckDepositSubmittedToInternalBlockchainRequest";
import * as Errors from "./Errors";
import DepositRepositoryInterface from "context/Domain/DepositRepositoryInterface";
import {STATUS_SUBMITTED_TO_INTERNAL_BLOCKCHAIN} from "context/Domain/Deposit";

export default class CheckDepositSubmittedToInternalBlockchainRequestHandler implements UseCase<CheckDepositSubmittedToInternalBlockchainRequest, boolean> {
    constructor(
        private _repository: DepositRepositoryInterface
    ) {}

    async execute(command: CheckDepositSubmittedToInternalBlockchainRequest): Promise<boolean> {
        const deposit = await this._repository.getByRequestId(command.sessionId)

        if (!deposit) {
            throw new Errors.DepositNotFound(command.sessionId)
        }

        return deposit.status === STATUS_SUBMITTED_TO_INTERNAL_BLOCKCHAIN;
    }
}
