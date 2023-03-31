import { Module } from '@nestjs/common';
import GetSettingsController from './GetSettingsController';
import SubmitDepositRequestController from "./SubmitDepositRequestController";
import CheckDepositSubmittedToInternalBlockchainController from "./CheckDepositSubmittedToInternalBlockchainController";

@Module({
    controllers: [
        GetSettingsController,
        SubmitDepositRequestController,
        CheckDepositSubmittedToInternalBlockchainController,
    ],
})
export default class WalletModule {}
