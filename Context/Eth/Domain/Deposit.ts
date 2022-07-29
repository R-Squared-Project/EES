export default class Deposit {
    private status: number

    constructor(
        private _txHash: string,
        private _contractId: string,
        private _sender: string,
        private _receiver: string,
        private _receiverRevpop: string,
        private _amount: string,
        private _hashLock: string,
        private _timeLock: number,
    ) {
        this.status = 1
    }
}