import Setting from "context/Setting/Setting";
import {UseCase} from "context/Core/Domain/UseCase";
import GetLastDepositContracts from "./GetLastDepositContracts";
import InternalBlockchain from "context/InternalBlockchain/InternalBlockchain";
import Response from "./Response";

export default class GetLastDepositContractsHandler implements UseCase<GetLastDepositContracts, Response> {
    public constructor(
        private readonly internalBlockchain: InternalBlockchain,
        private setting: Setting
    ) {}

    public async execute(query: GetLastDepositContracts): Promise<Response> {
        return new Response('1.16.1', [])
    }
}
