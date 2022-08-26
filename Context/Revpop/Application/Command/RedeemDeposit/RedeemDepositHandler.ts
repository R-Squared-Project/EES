import RedeemDeposit from "./RedeemDeposit";
import RepositoryInterface from "../../../Domain/RepositoryInterface";
import {Result, Either, right, left} from "../../../../Core";
import {UseCase} from "../../../../Core/Domain/UseCase";
import {UnexpectedError} from "../../../../Core/Logic/AppError";
import {DepositNotFound} from "./Errors";
import {CreateInRevpopBlockchainUnexpectedError} from "../../../Domain/Errors";

type Response = Either<
    UnexpectedError | DepositNotFound | CreateInRevpopBlockchainUnexpectedError,
    Result<void>
>

export default class RedeemDepositHandler implements UseCase<RedeemDeposit, Response> {
    constructor(
        private _repository: RepositoryInterface,
    ) {}

    async execute(command: RedeemDeposit): Promise<Response> {
        const deposit = await this._repository.getByRevpopContractId(command.contractId)

        if (deposit === null) {
            return left(new DepositNotFound(command.contractId));
        }

        const result = deposit.redeem()

        if (result.isLeft()) {
            return result
        }

        await this._repository.save(deposit)

        return right(result.value);
    }
}