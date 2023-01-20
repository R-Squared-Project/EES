import {UseCase} from "context/Core/Domain/UseCase";
import ConfirmDepositInternalContractCreated from "./ConfirmDepositInternalContractCreated";
import InternalBlockchain from "context/InternalBlockchain/InternalBlockchain";
import DepositRepositoryInterface from "context/Domain/DepositRepositoryInterface";
import InternalContract from "context/Domain/InternalContract";

export default class ConfirmDepositInternalContractCreatedHandler implements UseCase<ConfirmDepositInternalContractCreated, void> {
    public constructor(
        private readonly depositRepository: DepositRepositoryInterface,
        private readonly internalBlockchain: InternalBlockchain
    ) {}

    public async execute(command: ConfirmDepositInternalContractCreated): Promise<void> {
        const contracts = await this.internalBlockchain.getIncomingContracts()

        for (const contract of contracts) {
            const deposit = await this.depositRepository.getByExternalId(contract.externalId)

            if (null === deposit) {
                //TODO::unknown HTLC contract in an internal blockchain
                 continue
            }

            const internalContract = new InternalContract(contract.id, contract.externalId)
            deposit.createdInInternalBlockchain(internalContract)

            this.depositRepository.save(deposit)
        }

        return Promise.resolve(undefined)
    }
}
