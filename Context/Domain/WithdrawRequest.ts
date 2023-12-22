import AggregateRoot from "../Core/Domain/AggregateRoot";
import NativeAccount from "./ValueObject/NativeAccount";
import { WithdrawRequestValidationError } from "context/Domain/Errors";
import Fs from "fs";
import Path from "path";

export const STATUS_CREATED = 1;
export const STATUS_WITHDRAW_CREATED = 5;

export default class WithdrawRequest extends AggregateRoot {
    private _status: number;
    private constructor(
        private _nativeAccount: NativeAccount,
        private _amountToPayInRQETH: number,
        private _addressOfUserInEthereum: string,
        private _withdrawalFeeAmount: number,
        private _withdrawalFeeCurrency: string
    ) {
        super();
        this._status = STATUS_CREATED;
    }

    get nativeAccount(): NativeAccount {
        return this._nativeAccount;
    }

    get amountToPayInRQETH(): number {
        return this._amountToPayInRQETH;
    }

    get addressOfUserInEthereum(): string {
        return this._addressOfUserInEthereum;
    }

    get status(): number {
        return this._status;
    }

    get withdrawalFeeAmount(): number {
        return this._withdrawalFeeAmount;
    }

    get withdrawalFeeCurrency(): string {
        return this._withdrawalFeeCurrency;
    }

    static create(
        nativeAccount: NativeAccount,
        amountToPayInRQETH: number,
        addressOfUserInEthereum: string,
        withdrawalFeeAmount: number,
        withdrawalFeeCurrency: string
    ): WithdrawRequest {
        if (amountToPayInRQETH <= 0) {
            throw new WithdrawRequestValidationError("Amount to pay in RQETH can not be negative or zero");
        }
        if (addressOfUserInEthereum.length === 0) {
            throw new WithdrawRequestValidationError("Address of user in Ethereum can not be empty");
        }

        const sanctionedAddresses = JSON.parse(Fs.readFileSync(Path.resolve(__dirname, '../../src/assets/SanctionedAddresses/', 'sanctioned_addresses_ETH.json'), 'utf8'))

        if(sanctionedAddresses.includes(addressOfUserInEthereum)){
            throw new WithdrawRequestValidationError("Address of user in Ethereum is sanctioned");
        }
        if (withdrawalFeeAmount <= 0) {
            throw new WithdrawRequestValidationError("Withdrawal fee amount can not be negative or zero");
        }
        if (withdrawalFeeCurrency.length === 0) {
            throw new WithdrawRequestValidationError("Withdrawal fee currency can not be empty");
        }
        return new WithdrawRequest(
            nativeAccount,
            amountToPayInRQETH,
            addressOfUserInEthereum,
            withdrawalFeeAmount,
            withdrawalFeeCurrency
        );
    }

    withdrawCreated(): void {
        this._status = STATUS_WITHDRAW_CREATED;
    }
}
