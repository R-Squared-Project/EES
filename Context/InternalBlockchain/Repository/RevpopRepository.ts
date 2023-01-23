import RepositoryInterface from "./RepositoryInterface";
//@ts-ignore
import {Apis} from "@revolutionpopuli/revpopjs-ws";
//@ts-ignore
import { FetchChain, TransactionBuilder, PrivateKey } from "@revolutionpopuli/revpopjs";
import * as Errors from "context/InternalBlockchain/Errors";
import {InternalBlockchainConnectionError} from "context/Infrastructure/Errors";
import Memo from "context/InternalBlockchain/Memo";
import Contract from "context/InternalBlockchain/Contract";

const PREIMAGE_HASH_CIPHER_SHA256 = 2

export default class RevpopRepository implements RepositoryInterface {
    private memo: Memo
    public constructor(
        private readonly accountFrom: string,
        private readonly accountPrivateKey: string,
        private readonly assetSymbol: string
    ) {
        this.memo = new Memo()
    }

    public static async init(
        nodeUrl: string,
        accountFrom: string,
        accountPrivateKey: string,
        assetSymbol: string
    ): Promise<RevpopRepository> {
        const repository = new RevpopRepository(accountFrom, accountPrivateKey, assetSymbol)
        await repository.connect(nodeUrl)
        return repository
    }


    async createContract(externalId: string, accountToName: string, amount: number, hashLock: string, timeLock: number) {
        const accountFrom = await FetchChain("getAccount", this.accountFrom)
        const accountTo = await FetchChain("getAccount", accountToName)

        if (null === accountTo) {
            throw new Errors.AccountNotFound(accountToName)
        }

        const privateKey = PrivateKey.fromWif(this.accountPrivateKey);

        const asset = await FetchChain("getAsset", this.assetSymbol)

        if (asset === null) {
            throw new Errors.AssetNotFoundError(this.assetSymbol)
        }

        const amountWithPrecision = amount * Math.pow(10, asset.get('precision'))

        const txIssueAsset = new TransactionBuilder();
        txIssueAsset.add_type_operation("asset_issue", {
            fee: {
                amount: 0,
                asset_id: 0
            },
            issuer: accountFrom.get('id'),
            asset_to_issue: {
                amount: amountWithPrecision,
                asset_id: asset.get("id")
            },
            issue_to_account: accountFrom.get("id")
        });
        txIssueAsset.set_required_fees()
        txIssueAsset.add_signer(privateKey)

        try {
            await txIssueAsset.broadcast()
        } catch (e: unknown) {
            throw new Errors.IssueAssetError()
        }

        const txHtlcCreate = new TransactionBuilder();
        txHtlcCreate.add_type_operation("htlc_create", {
            from: accountFrom.get('id'),
            to: accountTo.get('id'),
            fee: {
                amount: 0,
                asset_id: 0
            },
            amount: {
                amount: amountWithPrecision,
                asset_id: asset.get('id')
            },
            preimage_hash: [PREIMAGE_HASH_CIPHER_SHA256, hashLock],
            preimage_size: hashLock.length,
            claim_period_seconds: timeLock,
            extensions: {
                memo: this.memo.generate(externalId, privateKey, accountFrom, accountTo)
            }
        });

        txHtlcCreate.set_required_fees()
        txHtlcCreate.add_signer(privateKey)

        try {
            await txHtlcCreate.broadcast()
        } catch (e: unknown) {
            throw new Errors.CreateHtlcError()
        }
    }

    async getIncomingContracts(accountFromName: string, start: string): Promise<Contract[]> {
        const revpopContracts = await Apis.instance()
            .db_api()
            .exec("get_htlc_by_from", [accountFromName, start, 100]);

        const contracts = []

        for (const contract of revpopContracts) {
            contracts.push(new Contract(contract.id, contract.memo.message))
        }

       return contracts
    }

    public async connect(nodeUrl: string) {
        try {
            await Apis.instance(nodeUrl, true).init_promise
        } catch (e: unknown) {
            throw new InternalBlockchainConnectionError(`Can't connect to the url ${nodeUrl}`)
        }
    }

    public async disconnect() {
        Apis.close()
    }
}
