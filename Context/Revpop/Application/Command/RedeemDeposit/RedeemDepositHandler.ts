import RedeemDeposit from "./RedeemDeposit";
import RepositoryInterface from "../../../Domain/RepositoryInterface";
import {Result, Either, right, left} from "../../../../Core";
import {UseCase} from "../../../../Core/Domain/UseCase";
import {UnexpectedError} from "../../../../Core/Logic/AppError";
import {DepositNotFound} from "./Errors";

type Response = Either<
    UnexpectedError,
    Result<void>
>

export default class RedeemDepositHandler implements UseCase<RedeemDeposit, Response> {
    constructor(
        private _repository: RepositoryInterface,
    ) {}

    async execute(command: RedeemDeposit): Promise<Response> {
        console.log(command.contractId)
        const deposit = await this._repository.getByRevpopContractId(command.contractId)

        if (deposit === null) {
            return left(Result.fail<void>(new DepositNotFound(command.contractId))) as Response;
        }

        const result = deposit.redeem()

        if (result.isRight()) {
            await this._repository.save(deposit)
        }

        return right(Result.ok<void>());
    }
}