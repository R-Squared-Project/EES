import { Module } from '@nestjs/common';
import DepositModule from './wallet/wallet.module';

@Module({
    imports: [DepositModule],
})
export class AppModule {}