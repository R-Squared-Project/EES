import { CommandFactory } from 'nest-commander';
import {CliModule} from "context/Application/Cli/CliModule";

async function bootstrap() {
    await CommandFactory.run(CliModule, ['warn', 'error']);
}

bootstrap();