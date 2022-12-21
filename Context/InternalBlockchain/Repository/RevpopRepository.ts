import RepositoryInterface from "./RepositoryInterface";
//@ts-ignore
import {Manager} from "@revolutionpopuli/revpopjs-ws";
//@ts-ignore
import { FetchChain, TransactionBuilder, PrivateKey } from "@revolutionpopuli/revpopjs";
import {IssueAssetError} from "context/InternalBlockchain/Errors";
import dayjs from "dayjs";

const PREIMAGE_HASH_CIPHER_SHA256 = 2

export default class RevpopRepository implements RepositoryInterface {
    public constructor(
        private readonly nodeUrl: string,
        private readonly accountFrom: string,
        private readonly accountPrivateKey: string,
        private readonly assetSymbol: string
    ) {}

    async createContract(accountToName: string, amount: number, hashLock: string, timeLock: number) {
        await this.connect()

        const accountFrom = await FetchChain("getAccount", this.accountFrom)
        const accountTo = await FetchChain("getAccount", accountToName)

        const privateKey = PrivateKey.fromWif(this.accountPrivateKey);

        const asset = await FetchChain("getAsset", this.assetSymbol)

        if (asset === null) {
            return null
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
            throw new IssueAssetError()
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
            claim_period_seconds: timeLock - dayjs().unix()
        });

        txHtlcCreate.set_required_fees()
        txHtlcCreate.add_signer(privateKey)

        try {
            await txHtlcCreate.broadcast()
        } catch (e: unknown) {
            throw new IssueAssetError()
        }
    }

    private async connect() {
        const connectionManager = new Manager({
            url: this.nodeUrl,
            urls: [],
            optionalApis: {enableOrders: false},
        });

        return new Promise((resolve, reject) => {
            connectionManager.connect(true, this.nodeUrl)
                .then(async () => {
                    resolve(true)
                })
                .catch((e: unknown) => {
                    reject()
                });
        })
    }
}
