import dayjs from "dayjs";
import {Either, left, Result, right} from "../../../../Core";
import {UseCase} from "../../../../Core/Domain/UseCase";
import CreateDeposit from "./CreateDeposit";
import RepositoryInterface from "../../../Domain/RepositoryInterface";
import Deposit from "../../../Domain/Deposit";
import TxHash from "../../../Domain/TxHash";
import Address from "../../../Domain/Address";
import {UnexpectedError} from "../../../../Core/Logic/AppError";
import {DepositAlreadyExists} from "./Errors";

type Response = Either<
    UnexpectedError |
    DepositAlreadyExists,
    Result<Deposit>
>

export default class CreateDepositHandler implements UseCase<CreateDeposit, Response> {
    constructor(
        private _repository: RepositoryInterface,
    ) {}

    async execute(command: CreateDeposit): Promise<Response> {
        const isContractExists = await this._repository.isContractExists(command.contractId)

        if (isContractExists) {
            return left<DepositAlreadyExists, Result<Deposit>>(new DepositAlreadyExists(command.contractId));
        }

        const txHashOrError = TxHash.create(command.txHash)
        const senderOrError = Address.create(command.sender)
        const receiverOrError = Address.create(command.receiver)

        const combinedPropsResult = Result.combine([txHashOrError, senderOrError, receiverOrError]);

        if (combinedPropsResult.isFailure) {
            return left(Result.fail<void>(combinedPropsResult.error)) as Response;
        }

        const deposit = Deposit.create(
            txHashOrError.getValue() as TxHash,
            command.contractId,
            senderOrError.getValue() as Address,
            receiverOrError.getValue() as Address,
            command.value,
            command.hashLock,
            dayjs.unix(command.timelock).toDate()
        )

        await this._repository.create(deposit)

        return right(Result.ok<Deposit>(deposit)) as Response;
    }
}