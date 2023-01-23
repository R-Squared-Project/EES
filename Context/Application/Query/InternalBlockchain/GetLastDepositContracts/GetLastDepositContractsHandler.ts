import Setting from "context/Setting/Setting";
import {UseCase} from "context/Core/Domain/UseCase";
import GetLastDepositContracts from "./GetLastDepositContracts";
import InternalBlockchain from "context/InternalBlockchain/InternalBlockchain";
import Response from "./Response";

const DEPOSIT_LAST_PROCESSED_INTERNAL_CONTRACT = 'deposit_last_processed_internal_contract'

export default class GetLastDepositContractsHandler implements UseCase<GetLastDepositContracts, Response> {
    public constructor(
        private readonly internalBlockchain: InternalBlockchain,
        private setting: Setting
    ) {}

    public async execute(query: GetLastDepositContracts): Promise<Response> {
        const lastProcessesContract = await this.getLastProcessedContract()
        const [firstContractToProcessedId, firstContractToProcessedNumber] = await this.getFirstContractToProcessed(lastProcessesContract)

        const contracts = await this.internalBlockchain.getIncomingContracts(firstContractToProcessedId)
        const contractsToProcessed = []

        for(const contract of contracts) {
            if (!contract.hasExternalId()) {
                continue
            }

            const contractNumber = parseInt(contract.id.split('.')[2], 10)

            if (contractNumber < firstContractToProcessedNumber) {
                continue
            }

            contractsToProcessed.push(contract)
        }

        if (contractsToProcessed.length > 0) {
            await this.setting.save(DEPOSIT_LAST_PROCESSED_INTERNAL_CONTRACT, contractsToProcessed[contractsToProcessed.length - 1].id)
        }


        return new Response(contractsToProcessed)
    }

    private async getLastProcessedContract(): Promise<string | null> {
        const lastProcessesContractId = await this.setting.load(DEPOSIT_LAST_PROCESSED_INTERNAL_CONTRACT, false)

        if (!lastProcessesContractId) {
            return '1.16.0'
        }

        return lastProcessesContractId
    }

    private async getFirstContractToProcessed(lastProcessedContract: string | null): Promise<[string, number]> {
        if (null === lastProcessedContract) {
            return ['1.16.0', 0]
        }

        const lastProcessedIdParts = lastProcessedContract.split('.');
        const firstContractToProcessedNumber = parseInt(lastProcessedIdParts[2], 10) + 1
        lastProcessedIdParts[2] = firstContractToProcessedNumber.toString()

        return [lastProcessedIdParts.join('.'), firstContractToProcessedNumber]
    }
}
