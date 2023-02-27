import {UseCase} from "context/Core/Domain/UseCase";
import ConfirmDepositInternalContractCreated from "./ConfirmDepositInternalContractCreated";
import DepositRepositoryInterface from "context/Domain/DepositRepositoryInterface";
import InternalContract from "context/Domain/InternalContract";
import {DepositNotFound} from "./Errors";

export default class ConfirmDepositInternalContractCreatedHandler implements UseCase<ConfirmDepositInternalContractCreated, void> {
    public constructor(
        private readonly depositRepository: DepositRepositoryInterface
    ) {}

    public async execute(command: ConfirmDepositInternalContractCreated): Promise<void> {
        const externalId = this.ensureHasPrefix(command.externalId)
        const deposit = await this.depositRepository.getByExternalId(externalId)

        if (null === deposit) {
            throw new DepositNotFound(externalId)
        }

        const internalContract = new InternalContract(command.internalId)
        deposit.createdInInternalBlockchain(internalContract)

        this.depositRepository.save(deposit)
    }

    public ensureHasPrefix(externalId: string): string {
        if (externalId.substring(0, 2) !== "0x") {
            externalId = "0x" + externalId
        }

        return externalId
    }
}
