import Setting from "context/Setting/Setting";
import { UseCase } from "context/Core/Domain/UseCase";
import GetLastWithdrawContracts from "./GetLastWithdrawContracts";
import InternalBlockchain from "context/InternalBlockchain/InternalBlockchain";
import Response from "./Response";
import { Inject, Injectable } from "@nestjs/common";
import { WithdrawTransactionsCollection } from "context/InternalBlockchain/WithdrawTransactionsCollection";
//@ts-ignore
import { ChainTypes } from "@revolutionpopuli/revpopjs";

const REVPOP_LAST_PROCESSED_ACCOUNT_HISTORY_OPERATION_NAME = "revpop_last_processed_account_history_operation";

@Injectable()
export default class GetLastWithdrawContractsHandler implements UseCase<GetLastWithdrawContracts, Response> {
    public constructor(
        @Inject("InternalBlockchain") private readonly internalBlockchain: InternalBlockchain,
        private setting: Setting
    ) {}

    public async execute(query: GetLastWithdrawContracts): Promise<Response> {
        const lastProcessedAccountHistoryOperation = await this.setting.load(
            REVPOP_LAST_PROCESSED_ACCOUNT_HISTORY_OPERATION_NAME,
            "1." + ChainTypes.object_type.operation_history + ".0"
        );
        const operations = await this.internalBlockchain.getAccountHistory(lastProcessedAccountHistoryOperation);
        const eesAccount = await this.internalBlockchain.getEesAccount();
        const transactions = new WithdrawTransactionsCollection(eesAccount.get("id"));

        for (const operation of operations) {
            transactions.add(operation);
        }

        const lastOperation = operations.shift();
        if (lastOperation) {
            await this.setting.save(REVPOP_LAST_PROCESSED_ACCOUNT_HISTORY_OPERATION_NAME, lastOperation.id);
        }

        return new Response(transactions.transactions);
    }
}
