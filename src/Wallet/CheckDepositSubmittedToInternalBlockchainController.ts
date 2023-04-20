import {Controller, Post, Body, HttpCode, HttpException, HttpStatus, Inject} from '@nestjs/common';
import SuccessResponse from "../Response/SuccessResponse";
import DepositRepositoryInterface from "context/Domain/DepositRepositoryInterface";

interface Request {
    sessionId: string
}

@Controller('deposit/submitted')
export default class CheckDepositSubmittedToInternalBlockchainController {
    constructor(
        @Inject("DepositRepositoryInterface") private _repository: DepositRepositoryInterface
    ) {}

    @Post()
    @HttpCode(200)
    async create(@Body() request: Request): Promise<SuccessResponse> {
        const deposit = await this._repository.getByRequestId(request.sessionId)

        if (!deposit) {
            throw new HttpException("Deposit not found", HttpStatus.NOT_FOUND);
        }

        if (!deposit.isSubmittedToInternalBlockchain()) {
            throw new HttpException("Deposit Internal Contract is not confirmed", HttpStatus.BAD_REQUEST);
        }

        return Promise.resolve(SuccessResponse.create({
            submitted: true
        }))
    }
}
