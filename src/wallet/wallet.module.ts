import { Module } from '@nestjs/common';
import InitializeDepositController from './initialize_deposit.controller';

@Module({
    controllers: [InitializeDepositController],
})
export default class DepositModule {}