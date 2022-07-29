export default class ConfirmDepositByUser {
    constructor(
        private _txHash: string,
        private _sender: string,
        private _receiver: string,
        private _receiverRevpop: string,
        private _amount: string,
        private _hashLock: string,
        private _timeLock: number,
    ) {}
}