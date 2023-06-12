import { UseCase } from "context/Core/Domain/UseCase";
import ConfirmDepositInternalContractCreated from "./ConfirmDepositInternalContractCreated";
import DepositRepositoryInterface from "context/Domain/DepositRepositoryInterface";
import InternalContract from "context/Domain/InternalContract";
import { DepositNotFound } from "./Errors";
import { ensureHasPrefix } from "context/Infrastructure/Helpers";
import { STATUS_SUBMITTED_TO_INTERNAL_BLOCKCHAIN } from "context/Domain/Deposit";

export default class ConfirmDepositInternalContractCreatedHandler
    implements UseCase<ConfirmDepositInternalContractCreated, void>
{
    public constructor(private readonly depositRepository: DepositRepositoryInterface) {}

    public async execute(command: ConfirmDepositInternalContractCreated): Promise<void> {
        const txHash = ensureHasPrefix(command.txHash);
        let deposit = await this.depositRepository.getByTxHash(txHash);

        if (null === deposit) {
            throw new DepositNotFound(txHash);
        }

        if (deposit.status < STATUS_SUBMITTED_TO_INTERNAL_BLOCKCHAIN) {
            deposit = await this.depositRepository.getByTxHash(txHash);

            if (null === deposit) {
                throw new DepositNotFound(txHash);
            }
        }

        const internalContract = new InternalContract(command.internalId);
        deposit.createdInInternalBlockchain(internalContract);

        await this.depositRepository.save(deposit);
    }
}
