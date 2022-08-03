import {Module} from '@nestjs/common';
import DepositModule from './Wallet/WalletModule';
import {APP_INTERCEPTOR} from "@nestjs/core";
import {TransformInterceptor} from "./Interceptor/TransformInterceptor";

@Module({
    imports: [
        DepositModule
    ],
    providers: [
        {
            provide: APP_INTERCEPTOR,
            useClass: TransformInterceptor,
        },
    ],
})
export class AppModule {
}