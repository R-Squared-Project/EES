import RepositoryInterface from "./RepositoryInterface";
//@ts-ignore
import {Apis} from "@revolutionpopuli/revpopjs-ws";
//@ts-ignore
import { FetchChain, TransactionBuilder, PrivateKey } from "@revolutionpopuli/revpopjs";
import * as Errors from "context/InternalBlockchain/Errors";
import dayjs from "dayjs";
import {InternalBlockchainConnectionError} from "context/Infrastructure/Errors";

const PREIMAGE_HASH_CIPHER_SHA256 = 2

export default class RevpopRepository implements RepositoryInterface {
    public constructor(
        private readonly accountFrom: string,
        private readonly accountPrivateKey: string,
        private readonly assetSymbol: string
    ) {}

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

    async createContract(accountToName: string, amount: number, hashLock: string, timeLock: number) {
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
            // claim_period_seconds: 86400,
            claim_period_seconds: timeLock,
            extensions: {
                memo: {
                    from: "RVP6JaiMEZZ57Q75Xh3kVbJ4owX13p7f1kkV76B3xLNFuWHVbRSyZ",
                    to: "RVP6JaiMEZZ57Q75Xh3kVbJ4owX13p7f1kkV76B3xLNFuWHVbRSyZ",
                    nonce: "3892776441801919394",
                    message: "8f36e5f855d4bc12ebb56083bddff2aa"
                }
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

    public async connect(nodeUrl: string) {
        try {
            await Apis.instance(nodeUrl, true).init_promise
        } catch (e: unknown) {
            throw new InternalBlockchainConnectionError(`Can't connect to the url ${nodeUrl}`)
        }
    }
}
