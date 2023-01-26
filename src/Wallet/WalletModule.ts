import { Module } from '@nestjs/common';
import GetSettingsController from './GetSettingsController';
import SubmitDepositRequestController from "./SubmitDepositRequestController";

@Module({
    controllers: [
        GetSettingsController,
        SubmitDepositRequestController
    ],
})
export default class WalletModule {}
