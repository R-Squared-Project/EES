import {UseCase} from "context/Core/Domain/UseCase";
import SubmitDepositRequest from "./SubmitDepositRequest";
import DepositRequestRepositoryInterface from "context/Domain/DepositRequestRepositoryInterface";
import {DatabaseConnectionError} from "context/Infrastructure/Errors";
import DepositRequest from "context/Domain/DepositRequest";
import RevpopAccount from "context/Domain/ValueObject/RevpopAccount";
import HashLock from "context/Domain/ValueObject/HashLock";
import * as Errors from "./Errors";

export default class SubmitDepositRequestHandler implements UseCase<SubmitDepositRequest, void> {
    constructor(
        private _repository: DepositRequestRepositoryInterface
    ) {}

    async execute(command: SubmitDepositRequest): Promise<void> {
        const revpopAccount = RevpopAccount.create(command.revpopAccount)
        const hashLock = HashLock.create(command.hashLock)

        const exists = await this._repository.load(hashLock)

        if (exists) {
            throw new Errors.DepositRequestAlreadyExists(command.hashLock)
        }

        const depositRequest = DepositRequest.create(revpopAccount, hashLock)

        try {
            await this._repository.create(depositRequest)
        } catch (e: unknown) {
            throw new DatabaseConnectionError()
        }
    }
}
