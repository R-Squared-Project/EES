import {Controller, Get} from '@nestjs/common';

@Controller('deposit')
export default class InitializeDepositController {
    // @Post()
    // async create(@Body() createCatDto: CreateCatDto) {
    //     this.catsService.create(createCatDto);
    // }

    @Get("initialize")
    async findAll(): Promise<string> {
        return Promise.resolve("qwe")
    }
}