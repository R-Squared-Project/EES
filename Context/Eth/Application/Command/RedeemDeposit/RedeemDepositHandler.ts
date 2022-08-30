import RedeemDeposit from "./RedeemDeposit";
import RepositoryInterface from "../../../Domain/RepositoryInterface";
import {Result, Either, right, left} from "../../../../Core";
import {UseCase} from "../../../../Core/Domain/UseCase";
import {UnexpectedError} from "../../../../Core/Logic/AppError";
import {DepositNotFound} from "./Errors";
import ContractRepositoryInterface from "../../../Domain/ContractRepositoryInterface";
import RedeemTxHash from "../../../Domain/RedeemTxHash";
import {RedeemUnexpectedError} from "../../../Domain/Errors";

type Response = Either<
    UnexpectedError | DepositNotFound,
    Result<void>
>

export default class RedeemDepositHandler implements UseCase<RedeemDeposit, Response> {
    constructor(
        private _repository: RepositoryInterface,
        private contractRepository: ContractRepositoryInterface
    ) {}

    async execute(command: RedeemDeposit): Promise<Response> {
        const deposit = await this._repository.getByContractId(command.contractId)

        if (deposit === null) {
            return left(new DepositNotFound(command.contractId));
        }

        const redeemTxHashOrError = await this.contractRepository.redeem(command.contractId, command.secret)

        if (redeemTxHashOrError instanceof RedeemUnexpectedError) {
            return left(redeemTxHashOrError)
        }

        const result = deposit.redeem(RedeemTxHash.create(redeemTxHashOrError).getValue() as RedeemTxHash)

        if (result.isLeft()) {
            return result
        }

        await this._repository.save(deposit)

        return right(result.value);
    }
}