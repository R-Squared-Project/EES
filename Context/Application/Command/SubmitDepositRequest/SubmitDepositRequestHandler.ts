import {Either, left, Result, right} from "../../../Core";
import {UseCase} from "../../../Core/Domain/UseCase";
import SubmitDepositRequest from "./SubmitDepositRequest";
import DepositRequestRepositoryInterface from "../../../Domain/DepositRequestRepositoryInterface";
import RevpopAccount from "../../../Domain/ValueObject/RevpopAccount";
import HashLock from "../../../Domain/ValueObject/HashLock";
import {CreateDepositUnexpectedError} from "../../../Domain/Errors";
import {DatabaseConnectionError} from "../../../Infrastructure/Errors";
import DepositRequest from "../../../Domain/DepositRequest";

type Response = Either<
    DatabaseConnectionError |
    CreateDepositUnexpectedError,
    Result<void>
>

export default class SubmitDepositRequestHandler implements UseCase<SubmitDepositRequest, Response> {
    constructor(
        private _repository: DepositRequestRepositoryInterface
    ) {}

    async execute(command: SubmitDepositRequest): Promise<Response> {
        const revpopAccountOrError = RevpopAccount.create(command.revpopAccount)
        const hashLockOrError = HashLock.create(command.hashLock)

        const combinedPropsResult = Result.combine([revpopAccountOrError, hashLockOrError]);

        if (combinedPropsResult.isFailure) {
            return left(Result.fail<void>(combinedPropsResult.error)) as Response;
        }

        const result = DepositRequest.create(
            revpopAccountOrError.getValue() as RevpopAccount,
            hashLockOrError.getValue() as HashLock
        )

        if (result.isLeft()) {
            return left(result.value)
        }

        try {
            await this._repository.create(result.value.getValue() as DepositRequest)
        } catch (e: unknown) {
            return left(new DatabaseConnectionError())
        }

        return right(Result.ok<void>()) as Response;
    }
}
