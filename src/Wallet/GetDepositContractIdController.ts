import {Controller, Post, Body, HttpCode, HttpException, HttpStatus, Inject} from "@nestjs/common";
import SuccessResponse from "../Response/SuccessResponse";
import DepositRepositoryInterface from "context/Domain/DepositRepositoryInterface";

interface Request {
    sessionId: string;
}

@Controller("deposit/get-external-contract-id")
export default class GetDepositContractIdController {
    constructor(@Inject("DepositRepositoryInterface") private _repository: DepositRepositoryInterface) {}

    @Post()
    @HttpCode(200)
    async check(@Body() request: Request): Promise<SuccessResponse> {
        const deposit = await this._repository.getByRequestId(request.sessionId);

        if (!deposit) {
            throw new HttpException("Deposit not found", HttpStatus.NOT_FOUND);
        }

        return Promise.resolve(
            SuccessResponse.create({
                contractId: deposit._externalContract?.idString,
                sender: deposit._externalContract?.sender.value,
                refundedInExternalBlockchain: deposit.isRefundedInExternalBlockchain()
            })
        );
    }
}
