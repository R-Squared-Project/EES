import { UseCaseError } from "context/Core/Logic/UseCaseError";
import Withdraw from "context/Domain/Withdraw";

export class HardFailError extends UseCaseError {}

export class BlockIsReversible extends UseCaseError {
    constructor(operationId: string) {
        super(`Block of HTLC create operation ${operationId} is reversible.`);
    }
}

export class HTLCCreateOperationNotFound extends HardFailError {
    constructor(withdraw: Withdraw) {
        super(
            `The HTLC create operation ${withdraw.htlcCreateOperationId} of withdraw ${withdraw.idString} was not found.`
        );
    }
}

export class InvalidReceiver extends HardFailError {
    constructor(operationId: string) {
        super(`Invalid receiver of ${operationId}.`);
    }
}

export class InvalidAmount extends HardFailError {
    constructor(withdraw: Withdraw) {
        super(`Amount in ${withdraw.htlcCreateOperationId} smaller than minimum withdrawal amount.`);
    }
}

export class InvalidAsset extends HardFailError {
    constructor(withdraw: Withdraw) {
        super(`Asset of ${withdraw.htlcCreateOperationId} is invalid (is not RVETH).`);
    }
}

export class InvalidTimelock extends HardFailError {
    constructor(withdraw: Withdraw) {
        super(`Timelock of ${withdraw.htlcCreateOperationId} is invalid, must be greater than withdraw timelock.`);
    }
}

export class InvalidHashlock extends HardFailError {
    constructor(withdraw: Withdraw) {
        super(`Hashlock of ${withdraw.htlcCreateOperationId} is empty.`);
    }
}

export class InvalidPreimage extends HardFailError {
    constructor(withdraw: Withdraw) {
        super(`Preimage of ${withdraw.htlcCreateOperationId} must be absent.`);
    }
}

export class InvalidWithdrawalFee extends HardFailError {
    constructor(withdraw: Withdraw) {
        super(`Amount in ${withdraw.transferOperationId} smaller than minimum withdrawal fee.`);
    }
}
