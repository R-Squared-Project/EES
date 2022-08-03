import { Module } from '@nestjs/common';
import InitializeDepositController from './InitializeDepositController';
import ConfirmDepositController from "./ConfirmDepositController";

@Module({
    controllers: [
        InitializeDepositController,
        ConfirmDepositController
    ],
})
export default class WalletModule {}