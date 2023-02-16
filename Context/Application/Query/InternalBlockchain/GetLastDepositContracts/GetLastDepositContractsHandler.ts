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
        const lastProcessedContract = await this.getLastProcessedContract()
        const [nextContractToProcessId, getNextContractToProcess] = this.getNextContractToProcess(lastProcessedContract)

        const contracts = await this.internalBlockchain.getIncomingContracts(nextContractToProcessId)
        const contractsToProcessed = []

        for(const contract of contracts) {
            if (!contract.hasExternalId()) {
                continue
            }

            if (this.parseContractIdLastNumber(contract.id) < getNextContractToProcess) {
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
        return await this.setting.load(DEPOSIT_LAST_PROCESSED_INTERNAL_CONTRACT, null)
    }

    private getNextContractToProcess(lastProcessedContract: string | null): [string, number] {
        if (null === lastProcessedContract) {
            return ['1.16.0', 0]
        }

        const lastProcessedIdParts = lastProcessedContract.split('.');
        const nextContractToProcessedNumber = parseInt(lastProcessedIdParts[2], 10) + 1
        lastProcessedIdParts[2] = nextContractToProcessedNumber.toString()

        return [lastProcessedIdParts.join('.'), nextContractToProcessedNumber]
    }

    private parseContractIdLastNumber(id: string): number {
        return parseInt(id.split('.')[2], 10)
    }
}
