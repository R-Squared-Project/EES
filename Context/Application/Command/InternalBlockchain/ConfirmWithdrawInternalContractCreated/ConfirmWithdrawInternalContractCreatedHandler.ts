import { UseCase } from "context/Core/Domain/UseCase";
import ConfirmWithdrawInternalContractCreated from "./ConfirmWithdrawInternalContractCreated";
import DepositRepositoryInterface from "context/Domain/DepositRepositoryInterface";
import InternalContract from "context/Domain/InternalContract";
import { DepositNotFound } from "./Errors";
import { ensureHasPrefix } from "context/Infrastructure/Helpers";

export default class ConfirmWithdrawInternalContractCreatedHandler
    implements UseCase<ConfirmWithdrawInternalContractCreated, void>
{
    public constructor(private readonly depositRepository: DepositRepositoryInterface) {}

    public async execute(command: ConfirmWithdrawInternalContractCreated): Promise<void> {
        const txHash = ensureHasPrefix(command.txHash);
        const deposit = await this.depositRepository.getByTxHash(txHash);

        if (null === deposit) {
            throw new DepositNotFound(txHash);
        }

        const internalContract = new InternalContract(command.internalId);
        deposit.createdInInternalBlockchain(internalContract);

        await this.depositRepository.save(deposit);
    }
}
