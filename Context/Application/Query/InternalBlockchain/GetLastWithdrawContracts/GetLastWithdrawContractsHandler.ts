import Setting from "context/Setting/Setting";
import { UseCase } from "context/Core/Domain/UseCase";
import GetLastWithdrawContracts from "./GetLastWithdrawContracts";
import InternalBlockchain from "context/InternalBlockchain/InternalBlockchain";
import Response from "./Response";
import { Inject, Injectable } from "@nestjs/common";
import { WithdrawTransactionsCollection } from "context/InternalBlockchain/WithdrawTransactionsCollection";

@Injectable()
export default class GetLastWithdrawContractsHandler implements UseCase<GetLastWithdrawContracts, Response> {
    public constructor(
        @Inject("InternalBlockchain") private readonly internalBlockchain: InternalBlockchain,
        private setting: Setting
    ) {}

    public async execute(query: GetLastWithdrawContracts): Promise<Response> {
        const operations = await this.internalBlockchain.getAccountHistory();
        const eesAccount = await this.internalBlockchain.getEesAccount();
        const transactions = new WithdrawTransactionsCollection(eesAccount.get("id"));

        for (const operation of operations) {
            transactions.add(operation);
        }

        return new Response(transactions.transactions);
    }
}
