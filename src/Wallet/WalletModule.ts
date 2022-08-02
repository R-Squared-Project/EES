import { Module } from '@nestjs/common';
import InitializeDepositController from './InitializeDepositController';

@Module({
    controllers: [InitializeDepositController],
})
export default class WalletModule {}