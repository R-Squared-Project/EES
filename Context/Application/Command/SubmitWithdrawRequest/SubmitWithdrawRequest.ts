export default class SubmitWithdrawRequest {
    constructor(
        private _nativeAccount: string,
        private _amountToPayInRQETH: number,
        private _addressOfUserInEthereum: string,
        private _withdrawalFeeAmount: number,
        private _withdrawalFeeCurrency: string
    ) {}

    get nativeAccount(): string {
        return this._nativeAccount;
    }

    get amountToPayInRQETH(): number {
        return this._amountToPayInRQETH;
    }

    get addressOfUserInEthereum(): string {
        return this._addressOfUserInEthereum;
    }

    get withdrawalFeeAmount(): number {
        return this._withdrawalFeeAmount;
    }

    get withdrawalFeeCurrency(): string {
        return this._withdrawalFeeCurrency;
    }
}
