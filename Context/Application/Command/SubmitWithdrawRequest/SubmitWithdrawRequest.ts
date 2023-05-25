export default class SubmitWithdrawRequest {
    constructor(
        private _revpopAccount: string,
        private _amountToPayInRVETH: number,
        private _addressOfUserInEthereum: string,
        private _withdrawalFeeAmount: number,
        private _withdrawalFeeCurrency: string
    ) {}

    get revpopAccount(): string {
        return this._revpopAccount;
    }

    get amountToPayInRVETH(): number {
        return this._amountToPayInRVETH;
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
