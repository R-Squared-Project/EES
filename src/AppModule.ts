import {Module} from '@nestjs/common';
import WalletModule from './Wallet/WalletModule';
import {APP_INTERCEPTOR} from "@nestjs/core";
import {TransformInterceptor} from "./Interceptor/TransformInterceptor";

@Module({
    imports: [
        WalletModule
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
