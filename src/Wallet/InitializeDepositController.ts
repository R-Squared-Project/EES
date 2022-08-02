import {Controller, Get} from '@nestjs/common';
import {InitializeDeposit, initializeDepositHandler} from "../../Context/Wallet";

@Controller('deposit')
export default class InitializeDepositController {
    @Get("initialize")
    async initialize(): Promise<any> {
        const command = new InitializeDeposit()
        const depositOrError = initializeDepositHandler.execute(command)

        if (depositOrError.isLeft()) {
            return "error"
        }

        return Promise.resolve({
            sessionId: depositOrError.value.getValue()?.sessionId
        })
    }
}