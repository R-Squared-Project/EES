import { UseCase } from "context/Core/Domain/UseCase";
import WithdrawRepositoryInterface from "context/Domain/WithdrawRepositoryInterface";
import { Inject, Injectable } from "@nestjs/common";
import InternalBlockchain from "context/InternalBlockchain/InternalBlockchain";
import AssetNormalizer from "context/Infrastructure/AssetNormalizer";
import ConfirmWithdrawProcessed from "context/Application/Command/InternalBlockchain/ConfirmWithdrawProcessed/ConfirmWithdrawProcessed";
import Setting, { INTERNAL_REDEEM_ALERT_THRESHOLD_TIMEOUT } from "context/Setting/Setting";
import dayjs from "dayjs";
import NotifierInterface from "context/Notifier/NotifierInterface";

@Injectable()
export default class ConfirmWithdrawProcessedHandler implements UseCase<ConfirmWithdrawProcessed, void> {
    private lastIrreversibleBlockNumber: number | undefined = undefined;

    public constructor(
        @Inject("WithdrawRepositoryInterface") private readonly withdrawRepository: WithdrawRepositoryInterface,
        @Inject("InternalBlockchain") private readonly internalBlockchain: InternalBlockchain,
        private readonly normalizer: AssetNormalizer,
        private readonly setting: Setting,
        @Inject("NotifierInterface") private readonly notifier: NotifierInterface
    ) {}

    public async execute(command: ConfirmWithdrawProcessed): Promise<void> {
        this.lastIrreversibleBlockNumber = undefined;

        if (
            command.withdraw.internalRedeemBlockNumber &&
            (await this.isLastIrreversible(command.withdraw.internalRedeemBlockNumber))
        ) {
            command.withdraw.processed();
            await this.withdrawRepository.save(command.withdraw);

            return;
        }

        const alertPeriod = parseInt(await this.setting.load(INTERNAL_REDEEM_ALERT_THRESHOLD_TIMEOUT, "86400"));

        const timeDifference = dayjs(command.withdraw.internalContract.createdAt)
            .add(command.withdraw.timelock ?? 0, "minutes")
            .diff(dayjs(), "seconds");

        if (timeDifference > alertPeriod) {
            await this.notifier.sendMessage("Timeout of HTLC Redeem in Internal Blockchain");
        }
    }

    private async isLastIrreversible(blockNumber: number): Promise<boolean> {
        if (!this.lastIrreversibleBlockNumber) {
            this.lastIrreversibleBlockNumber = await this.internalBlockchain.getLastIrreversibleBlockNumber();
        }

        return blockNumber <= this.lastIrreversibleBlockNumber;
    }
}
