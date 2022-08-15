import ConfirmDeposit from "./ConfirmDeposit";
import RepositoryInterface from "../../../Domain/RepositoryInterface";
import {Result, Either, right, left} from "../../../../Core";
import {UseCase} from "../../../../Core/Domain/UseCase";
import {UnexpectedError} from "../../../../Core/Logic/AppError";

type Response = Either<
    UnexpectedError,
    Result<void>
>

export default class ConfirmDepositHandler implements UseCase<ConfirmDeposit, Response> {
    constructor(
        private _repository: RepositoryInterface,
    ) {}

    async execute(command: ConfirmDeposit): Promise<Response> {
        const deposit = await this._repository.getByTxHash(command.txHash)

        return right(Result.ok<void>()) as Response;
    }
}