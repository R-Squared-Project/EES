import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import {Either, left, Result, right} from '../../../../Core';
import {UseCase} from '../../../../Core/Domain/UseCase';
import CreateDeposit from './CreateDeposit';
import RepositoryInterface from '../../../Domain/RepositoryInterface';
import Deposit from '../../../Domain/Deposit';
import TxHash from '../../../Domain/TxHash';
import Address from '../../../Domain/Address';
import {UnexpectedError} from '../../../../Core/Logic/AppError';
import {
    AlreadyRefunded,
    AlreadyWithdrawn,
    DepositAlreadyExists,
    DepositIsToSmall,
    ReceiverIsInvalid,
    TimeLockIsToSmall,
    TransactionNotFoundInBlockchain
} from './Errors';
import ContractRepositoryInterface from '../../../Domain/ContractRepositoryInterface';
import Contract from '../../../Domain/Contract';
import Web3 from 'web3';
type Response = Either<
    UnexpectedError |
    DepositAlreadyExists,
    Result<Deposit>
>

dayjs.extend(duration)

export default class CreateDepositHandler implements UseCase<CreateDeposit, Response> {
    constructor(
        private repository: RepositoryInterface,
        private contractRepository: ContractRepositoryInterface
    ) {}

    async execute(command: CreateDeposit): Promise<Response> {
        const isTxIncluded = await this.contractRepository.isTxIncluded(command.txHash)
        if (!isTxIncluded) {
            return left(new TransactionNotFoundInBlockchain(command.txHash));
        }

        const isContractExists = await this.repository.isContractExists(command.contractId)
        if (isContractExists) {
            return left(new DepositAlreadyExists(command.contractId));
        }

        const contract = await this.contractRepository.load(command.txHash, command.contractId)
        const errors = this.validateContract(contract)

        const txHashOrError = TxHash.create(command.txHash)
        const senderOrError = Address.create(contract.sender)
        const receiverOrError = Address.create(contract.receiver)

        const combinedPropsResult = Result.combine([txHashOrError, senderOrError, receiverOrError, ...errors]);

        if (combinedPropsResult.isFailure) {
            return left(Result.fail<void>(combinedPropsResult.error)) as Response;
        }

        const deposit = Deposit.create(
            txHashOrError.getValue() as TxHash,
            command.contractId,
            senderOrError.getValue() as Address,
            receiverOrError.getValue() as Address,
            contract.value,
            contract.hashLock,
            dayjs.unix(contract.timeLock).toDate()
        )

        await this.repository.create(deposit)

        return right(Result.ok<Deposit>(deposit)) as Response;
    }


    //TODO:: Use class-validator ?
    private validateContract(contract: Contract): Result<string>[] {
        const errors: Result<string>[] = []

        if (contract.receiver !== process.env.ETH_RECEIVER) {
            errors.push(Result.fail(new ReceiverIsInvalid()))
        }

        const minimumDepositAmountWei = Web3.utils.toWei(process.env.MINIMUM_DEPOSIT_AMOUNT as string)
        if (contract.value < minimumDepositAmountWei) {
            errors.push(Result.fail(new DepositIsToSmall(
                process.env.MINIMUM_DEPOSIT_AMOUNT as string,
                Web3.utils.fromWei(contract.value, 'ether'),
            )))
        }

        const timeLockLimit = contract.createdAt.add(
            parseInt(process.env.MINUMUM_TIMELOCK as string, 10),
            'minutes'
        ).unix()

        if (contract.timeLock < timeLockLimit) {
            errors.push(Result.fail(new TimeLockIsToSmall(
                dayjs.duration(parseInt(process.env.MINUMUM_TIMELOCK as string, 10)).asMinutes(),
                dayjs.unix(contract.timeLock).format(),
            )))
        }

        if (contract.withdrawn) {
            errors.push(Result.fail(new AlreadyWithdrawn()))
        }

        if (contract.refunded) {
            errors.push(Result.fail(new AlreadyRefunded()))
        }

        return errors
    }
}