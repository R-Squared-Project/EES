import {UseCase} from "context/Core/Domain/UseCase";
import SubmitDepositRequest from "./SubmitDepositRequest";
import DepositRequestRepositoryInterface from "context/Domain/DepositRequestRepositoryInterface";
import {DatabaseConnectionError} from "context/Infrastructure/Errors";
import DepositRequest from "context/Domain/DepositRequest";
import RevpopAccount from "context/Domain/ValueObject/RevpopAccount";
import HashLock from "context/Domain/ValueObject/HashLock";
import {
    HashLockValidationError,
    RevpopAccountValidationError
} from "context/Domain/Errors";

export default class SubmitDepositRequestHandler implements UseCase<SubmitDepositRequest, void> {
    constructor(
        private _repository: DepositRequestRepositoryInterface
    ) {}

    async execute(command: SubmitDepositRequest): Promise<void> {
        const revpopAccountOrError = RevpopAccount.create(command.revpopAccount)
        if (revpopAccountOrError.isFailure) {
            throw new RevpopAccountValidationError(revpopAccountOrError.error as string, command.revpopAccount)
        }

        const hashLockOrError = HashLock.create(command.hashLock)
        if (hashLockOrError.isFailure) {
            throw new HashLockValidationError(hashLockOrError.error as string, command.hashLock)
        }

        const depositRequest = DepositRequest.create(
            revpopAccountOrError.getValue() as RevpopAccount,
            hashLockOrError.getValue() as HashLock
        )

        try {
            await this._repository.create(depositRequest)
        } catch (e: unknown) {
            throw new DatabaseConnectionError()
        }
    }
}
