import { UseCase } from "context/Core/Domain/UseCase";
import WithdrawRepositoryInterface from "context/Domain/WithdrawRepositoryInterface";
import { Inject, Injectable } from "@nestjs/common";
import WithdrawRequestRepositoryInterface from "context/Domain/WithdrawRequestRepositoryInterface";
import InternalBlockchain from "context/InternalBlockchain/InternalBlockchain";
// eslint-disable-next-line max-len
import CheckInternalWithdrawalOperation from "context/Application/Command/InternalBlockchain/CheckInternalWithdrawalOperation/CheckInternalWithdrawalOperation";
import * as Errors from "./Errors";
import Withdraw from "context/Domain/Withdraw";
import { Map } from "immutable";
import config from "context/config";
import AssetNormalizer from "context/Infrastructure/AssetNormalizer";

@Injectable()
export default class CheckInternalWithdrawalOperationHandler
    implements UseCase<CheckInternalWithdrawalOperation, void>
{
    private lastIrreversibleBlockNumber: number | undefined = undefined;
    private eesAccountId: string | undefined;

    public constructor(
        @Inject("WithdrawRepositoryInterface") private readonly withdrawRepository: WithdrawRepositoryInterface,
        @Inject("WithdrawRequestRepositoryInterface")
        private readonly withdrawRequestRepository: WithdrawRequestRepositoryInterface,
        @Inject("InternalBlockchain") private readonly internalBlockchain: InternalBlockchain,
        private readonly normalizer: AssetNormalizer
    ) {}

    public async execute(command: CheckInternalWithdrawalOperation): Promise<void> {
        this.lastIrreversibleBlockNumber = undefined;

        try {
            const htlcOperation = await this.internalBlockchain.getObject(command.withdraw.htlcCreateOperationId);
            await this.checkHTLCOperation(htlcOperation, command.withdraw);

            const transferOperation = await this.internalBlockchain.getObject(command.withdraw.transferOperationId);
            await this.checkTransferOperation(transferOperation, command.withdraw);

            command.withdraw.readyToProcess(
                htlcOperation.get("op")[1].preimage_hash[1],
                htlcOperation.get("op")[1].claim_period_seconds,
                htlcOperation.get("op")[1].amount.amount,
                transferOperation.get("op")[1].amount.amount,
                transferOperation.get("op")[1].amount.asset_id
            );
        } catch (error: unknown) {
            if (error instanceof Error) {
                command.withdraw.error(error.message);
            }
        }

        this.withdrawRepository.save(command.withdraw);
    }

    public async checkHTLCOperation(htlcOperation: Map<string, any>, withdraw: Withdraw) {
        if (!htlcOperation) {
            throw new Errors.HTLCCreateOperationNotFound(withdraw);
        }

        await this.checkLastIrreversible(htlcOperation);
        await this.checkReceiver(htlcOperation);

        const normilizedAmount = this.normalizer.normalize(
            htlcOperation.get("op")[1].amount.amount,
            this.internalBlockchain.getAsset(htlcOperation.get("op")[1].amount.asset_id)
        );
        console.log(config.eth.minimum_withdraw_amount.toNumber(), "minimum_withdraw_amount");
        if (normilizedAmount < config.eth.minimum_withdraw_amount.toNumber()) {
            throw new Errors.InvalidAmount(withdraw);
        }

        if (htlcOperation.get("op")[1].amount.asset_id != "1.3.1") {
            throw new Errors.InvalidAsset(withdraw);
        }

        if (htlcOperation.get("op")[1].claim_period_seconds < config.contract.withdrawn_timelock) {
            throw new Errors.InvalidTimelock(withdraw);
        }

        if (!htlcOperation.get("op")[1].preimage_hash[1]) {
            throw new Errors.InvalidHashlock(withdraw);
        }

        if (htlcOperation.get("op")[1].preimage) {
            throw new Errors.InvalidPreimage(withdraw);
        }
    }

    private async checkTransferOperation(transferOperation: Map<string, any>, withdraw: Withdraw) {
        await this.checkLastIrreversible(transferOperation);
        await this.checkReceiver(transferOperation);

        let minimalWithdrawalFee = config.revpop.rveth_withdrawal_fee;
        if (transferOperation.get("op")[1].amount.asset_id == "1.3.0") {
            minimalWithdrawalFee = config.revpop.rvp_withdrawal_fee;
        }

        if (transferOperation.get("op")[1].amount.amount < minimalWithdrawalFee) {
            throw new Errors.InvalidWithdrawalFee(withdraw);
        }
    }

    private async checkLastIrreversible(operation: Map<string, any>) {
        if (!this.lastIrreversibleBlockNumber) {
            this.lastIrreversibleBlockNumber = await this.internalBlockchain.getLastIrreversibleBlockNumber();
        }

        if (operation.get("block_num") > this.lastIrreversibleBlockNumber) {
            throw new Errors.BlockIsReversible(operation.get("id"));
        }
    }

    private async checkReceiver(operation: Map<string, any>) {
        if (!this.eesAccountId) {
            this.eesAccountId = (await this.internalBlockchain.getEesAccount()).get("id");
        }
        if (operation.get("op")[1].to != this.eesAccountId) {
            throw new Errors.InvalidReceiver(operation.get("id"));
        }
    }
}
