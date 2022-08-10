import InitializeDeposit from "./InitializeDeposit";
import RepositoryInterface from "../../../Domain/RepositoryInterface";
import SecretGeneratorInterface from "../../../Infrastructure/SecretGenerator/SecretGeneratorInterface";
import Deposit from "../../../Domain/Deposit";
import {Result, Either, right, left} from "../../../../Core";
import {UseCase} from "../../../../Core/Domain/UseCase";
import {UnexpectedError} from "../../../../Core/Logic/AppError";
import SessionId from "../../../Domain/SessionId";

type Response = Either<
    UnexpectedError,
    Result<Deposit>
>

export default class InitializeDepositHandler implements UseCase<InitializeDeposit, Response> {
    constructor(
        private _repository: RepositoryInterface,
        private _secretGenerator: SecretGeneratorInterface
    ) {}

    execute(_: InitializeDeposit): Response {
        const sessionIdOrError = SessionId.create(this._secretGenerator.generate())

        const combinedPropsResult = Result.combine([ sessionIdOrError ]);

        if (combinedPropsResult.isFailure) {
            return left(Result.fail<void>(combinedPropsResult.error)) as Response;
        }

        const deposit = Deposit.create(sessionIdOrError.getValue() as SessionId)

        this._repository.create(deposit);

        return right(Result.ok<Deposit>(deposit)) as Response;
    }
}