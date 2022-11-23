import {Either, left, Result, right} from "../../../Core";
import {UseCase} from "../../../Core/Domain/UseCase";
import CreateDeposit from "./CreateDeposit";
import RepositoryInterface from "../../../Domain/RepositoryInterface";
import RevpopAccount from "../../../Domain/ValueObject/RevpopAccount";
import HashLock from "../../../Domain/ValueObject/HashLock";
import Deposit from "../../../Domain/Deposit";
import {CreateDepositUnexpectedError} from "../../../Domain/Errors";
import {DatabaseConnectionError} from "../../../Infrastructure/Errors";

type Response = Either<
    DatabaseConnectionError |
    CreateDepositUnexpectedError,
    Result<void>
>

export default class CreateDepositHandler implements UseCase<CreateDeposit, Response> {
    constructor(
        private _repository: RepositoryInterface
    ) {}

    async execute(command: CreateDeposit): Promise<Response> {
        const revpopAccountOrError = RevpopAccount.create(command.revpopAccount)
        const hashLockOrError = HashLock.create(command.hashLock)

        const combinedPropsResult = Result.combine([revpopAccountOrError, hashLockOrError]);

        if (combinedPropsResult.isFailure) {
            return left(Result.fail<void>(combinedPropsResult.error)) as Response;
        }

        const depositOrError = Deposit.create(
            revpopAccountOrError.getValue() as RevpopAccount,
            hashLockOrError.getValue() as HashLock
        )

        if (depositOrError.isLeft()) {
            return left(depositOrError.value)
        }

        try {
            await this._repository.create(depositOrError.value.getValue() as Deposit)
        } catch (e: unknown) {
            return left(new DatabaseConnectionError())
        }

        return right(Result.ok<void>()) as Response;
    }
}
