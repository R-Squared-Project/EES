import RepositoryInterface from "./RepositoryInterface";
//@ts-ignore
import { ChainTypes } from "@r-squared/rsquared-js";
//@ts-ignore
import { Apis, ChainConfig } from "@r-squared/rsquared-js-ws";
//@ts-ignore
import { Aes, FetchChain, TransactionBuilder, PrivateKey, ChainStore } from "@r-squared/rsquared-js";
import * as Errors from "context/InternalBlockchain/Errors";
import { InternalBlockchainConnectionError } from "context/Infrastructure/Errors";
import Memo from "context/InternalBlockchain/Memo";
import Contract from "context/InternalBlockchain/HtlcContract";
import OperationRedeem from "../OperationRedeem";
import OperationBurn from "context/InternalBlockchain/OperationBurn";
import OperationRefund from "../OperationRefund";
import WithdrawTransaction from "context/InternalBlockchain/WithdrawTransaction";
import { Map } from "immutable";

const PREIMAGE_HASH_CIPHER_SHA256 = 2;
const PREIMAGE_LENGTH = 32;

export default class NativeRepository implements RepositoryInterface {
    private memo: Memo;

    public constructor(
        private readonly eesAccount: string,
        private readonly accountPrivateKey: string,
        private readonly assetSymbol: string
    ) {
        this.memo = new Memo();
    }

    public static async init(
        nodeUrl: string,
        accountFrom: string,
        accountPrivateKey: string,
        assetSymbol: string,
        chainId: string
    ): Promise<NativeRepository> {
        ChainConfig.networks["RSquared"].chain_id = chainId;
        ChainConfig.setChainId(chainId);
        const repository = new NativeRepository(accountFrom, accountPrivateKey, assetSymbol);
        await repository.connect(nodeUrl);
        return repository;
    }

    async createContract(
        externalId: string,
        accountToName: string,
        amount: string,
        hashLock: string,
        timeLock: number
    ) {
        const accountFrom = await FetchChain("getAccount", this.eesAccount);
        const accountTo = await FetchChain("getAccount", accountToName);

        if (null === accountTo) {
            throw new Errors.AccountNotFound(accountToName);
        }

        const privateKey = PrivateKey.fromWif(this.accountPrivateKey);
        const asset = await this.getInternalAsset();
        const txIssueAsset = new TransactionBuilder();

        txIssueAsset.add_type_operation("asset_issue", {
            fee: {
                amount: 0,
                asset_id: 0,
            },
            issuer: accountFrom.get("id"),
            asset_to_issue: {
                amount: amount,
                asset_id: asset.get("id"),
            },
            issue_to_account: accountFrom.get("id"),
        });
        txIssueAsset.set_required_fees();
        txIssueAsset.add_signer(privateKey);

        try {
            await txIssueAsset.broadcast();
        } catch (e: unknown) {
            throw new Errors.IssueAssetError();
        }

        const txHtlcCreate = new TransactionBuilder();
        txHtlcCreate.add_type_operation("htlc_create", {
            from: accountFrom.get("id"),
            to: accountTo.get("id"),
            fee: {
                amount: 0,
                asset_id: 0,
            },
            amount: {
                amount: amount,
                asset_id: asset.get("id"),
            },
            preimage_hash: [PREIMAGE_HASH_CIPHER_SHA256, hashLock],
            preimage_size: PREIMAGE_LENGTH,
            claim_period_seconds: timeLock,
            extensions: {
                memo: this.memo.generate(externalId.slice(2), privateKey, accountFrom, accountTo),
            },
        });

        txHtlcCreate.set_required_fees();
        txHtlcCreate.add_signer(privateKey);

        try {
            await txHtlcCreate.broadcast();
        } catch (e: unknown) {
            throw new Errors.CreateHtlcError();
        }
    }

    async getIncomingContracts(start: string): Promise<Contract[]> {
        const nativeContracts = await Apis.instance().db_api().exec("get_htlc_by_from", [this.eesAccount, start, 100]);

        const privateKey = PrivateKey.fromWif(this.accountPrivateKey);

        const contracts = [];
        for (const contract of nativeContracts) {
            try {
                const message = Aes.decrypt_with_checksum(
                    privateKey,
                    contract.memo.to,
                    contract.memo.nonce,
                    contract.memo.message
                ).toString("utf-8");

                contracts.push(new Contract(contract.id, message));
            } catch (e: unknown) {
                continue;
            }
        }

        return contracts;
    }

    async getRedeemOperations(account: string): Promise<OperationRedeem[]> {
        const nativeOperations = await Apis.instance()
            .history_api()
            .exec("get_account_history_operations", [
                account,
                ChainTypes.operations.htlc_redeem,
                "1.11.0",
                "1.11.0",
                100,
            ]);

        const operations = [];
        for (const nativeOperation of nativeOperations) {
            operations.push(
                OperationRedeem.create(
                    account,
                    nativeOperation["op"][1]["htlc_id"],
                    Buffer.from(nativeOperation["op"][1]["preimage"], "hex").toString(),
                    nativeOperation["id"]
                )
            );
        }

        return operations;
    }

    async getRefundOperations(account: string): Promise<OperationRefund[]> {
        const mostRecently = "1." + ChainTypes.object_type.operation_history + ".0";
        const nativeOperations = await Apis.instance()
            .history_api()
            .exec("get_account_history", [this.eesAccount, mostRecently, 100, mostRecently]);

        const operations = [];
        for (const nativeOperation of nativeOperations) {
            if (nativeOperation["op"][0] == ChainTypes.operations.htlc_refund) {
                operations.push(
                    OperationRefund.create(account, nativeOperation["op"][1]["htlc_id"], nativeOperation["id"])
                );
            }
        }

        return operations;
    }

    public async connect(nodeUrl: string) {
        try {
            await Apis.instance(nodeUrl, true).init_promise;
        } catch (e: unknown) {
            throw new InternalBlockchainConnectionError(`Can't connect to the url ${nodeUrl}`);
        }
    }

    public async disconnect() {
        Apis.close();
    }

    async burnAsset(amount: string) {
        const accountTo = await this.getEesAccount();
        const privateKey = PrivateKey.fromWif(this.accountPrivateKey);
        const asset = await FetchChain("getAsset", this.assetSymbol);

        if (asset === null) {
            throw new Errors.AssetNotFoundError(this.assetSymbol);
        }

        const txReserveAsset = new TransactionBuilder();
        txReserveAsset.add_type_operation("asset_reserve", {
            fee: {
                amount: 0,
                asset_id: 0,
            },
            payer: accountTo.get("id"),
            amount_to_reserve: {
                amount: amount,
                asset_id: asset.get("id"),
            },
        });
        txReserveAsset.set_required_fees();
        txReserveAsset.add_signer(privateKey);

        try {
            await txReserveAsset.broadcast();
        } catch (e: unknown) {
            throw new Errors.ReserveAssetError();
        }
    }

    async getBurnOperations(account: string): Promise<OperationBurn[]> {
        const mostRecently = "1." + ChainTypes.object_type.operation_history + ".0";
        const nativeOperations = await Apis.instance()
            .history_api()
            .exec("get_account_history", [this.eesAccount, mostRecently, 100, mostRecently]);

        const operations = [];

        for (const nativeOperation of nativeOperations) {
            if (nativeOperation["op"][0] == ChainTypes.operations.asset_reserve) {
                operations.push(OperationBurn.create(account, nativeOperation["id"]));
            }
        }

        return operations;
    }

    async getInternalAsset(): Promise<Map<string, any>> {
        return await this.getAsset(this.assetSymbol);
    }

    async getAsset(assetId: string): Promise<Map<string, any>> {
        const [result] = await Apis.instance()
            .db_api()
            .exec("get_assets", [[assetId]]);

        return Map(result);
    }

    async getAccountHistory(lastProcessedAccountHistoryOperation: string): Promise<WithdrawTransaction[]> {
        const nativeOperations = await Apis.instance()
            .history_api()
            .exec("get_account_history", [
                this.eesAccount,
                lastProcessedAccountHistoryOperation,
                100,
                "1." + ChainTypes.object_type.operation_history + ".0",
            ]);

        const transactions = [];
        for (const nativeOperation of nativeOperations) {
            if (
                nativeOperation["op"][0] == ChainTypes.operations.transfer ||
                nativeOperation["op"][0] == ChainTypes.operations.htlc_create ||
                nativeOperation["op"][0] == ChainTypes.operations.htlc_redeemed
            ) {
                transactions.push(nativeOperation);
            }
        }

        return transactions;
    }

    async getAccount(accountId: string): Promise<Map<string, any>> {
        const account = await FetchChain("getAccount", accountId);

        if (null === account) {
            throw new Errors.AccountNotFound(account);
        }

        return account;
    }

    async getEesAccount(): Promise<Map<string, any>> {
        return await this.getAccount(this.eesAccount);
    }

    async getObject(objectId: string): Promise<Map<string, any>> {
        const [result] = await Apis.instance()
            .db_api()
            .exec("get_objects", [[objectId]]);

        return Map(result);
    }

    async getLastIrreversibleBlockNumber(): Promise<number> {
        const dynamicProperties = await this.getObject("2.1.0");

        return parseInt(dynamicProperties.get("last_irreversible_block_num"));
    }

    async withdrawRedeem(preimage: string, contractId: string, amount: string): Promise<void> {
        const accountTo = await this.getEesAccount();
        const privateKey = PrivateKey.fromWif(this.accountPrivateKey);
        const asset = await this.getAsset(this.assetSymbol);

        if (asset === null) {
            throw new Errors.AssetNotFoundError(this.assetSymbol);
        }

        const txRedeem = new TransactionBuilder();
        txRedeem.add_type_operation("htlc_redeem", {
            preimage: preimage.replace("0x", ""),
            fee: {
                amount: 0,
                asset_id: asset.get("id"),
            },
            htlc_id: contractId,
            redeemer: accountTo.get("id"),
        });

        txRedeem.add_type_operation("asset_reserve", {
            fee: {
                amount: 0,
                asset_id: 0,
            },
            payer: accountTo.get("id"),
            amount_to_reserve: {
                amount: amount,
                asset_id: asset.get("id"),
            },
        });

        txRedeem.set_required_fees();
        txRedeem.add_signer(privateKey);

        try {
            await txRedeem.broadcast();
        } catch (e: unknown) {
            throw new Errors.CreateHtlcError();
        }
    }
}
