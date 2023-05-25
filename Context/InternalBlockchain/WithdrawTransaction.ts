export default class WithdrawTransaction {
    public id: string | undefined;
    public blockNumber: number | undefined;
    public transactionInBlock: number | undefined;
    public transferId: string | undefined;
    public transferReceiver: string | undefined;
    public transferSender: string | undefined;
    public htlcCreateId: string | undefined;
    public htlcId: string | undefined;
    public htlcCreateReceiver: string | undefined;
    public htlcCreateSender: string | undefined;
    public denormalizedAmount: string | undefined;
    public htlcCreateAssetId: string | undefined;
    public hashLock: string | undefined;
    public hashMethod: number | undefined;
    public timeLock: number | undefined;

    constructor(public transactionId: string) {}
}
