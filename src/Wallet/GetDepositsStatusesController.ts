import {Controller, Post, Body, HttpCode, Inject} from "@nestjs/common";
import SuccessResponse from "../Response/SuccessResponse";
import DepositRepositoryInterface from "context/Domain/DepositRepositoryInterface";

interface Request {
    sessionIds: string[];
}

@Controller("deposit/get-statuses")
export default class GetDepositsStatusesController {
    constructor(@Inject("DepositRepositoryInterface") private _repository: DepositRepositoryInterface) {}

    @Post()
    @HttpCode(200)
    async check(@Body() request: Request): Promise<SuccessResponse> {
        const deposit = await this._repository.getByRequestIds(request.sessionIds);
        const result = [];

        for (const d of deposit) {
            result.push({
                sessionId: d._depositRequest?.idString,
                status: d.status
            });
        }

        return Promise.resolve(
            SuccessResponse.create(result)
        );
    }
}
