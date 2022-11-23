import { Module } from '@nestjs/common';
import CreateDepositController from './CreateDepositController';

@Module({
    controllers: [
        CreateDepositController
    ],
})
export default class WalletModule {}
