import {Module} from '@nestjs/common';
import DepositModule from './Wallet/WalletModule';

@Module({
    imports: [
        DepositModule
    ],
})
export class AppModule {
}