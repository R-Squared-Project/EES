export default class CreateDepositByEes {
    constructor(
        private _txHash: string,
        private _sender: string,
        private _receiver: string,
        private _amount: string,
        private _hashLock: string,
        private _timeLock: number,
    ) {}
}