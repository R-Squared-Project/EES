import path from "path";
import dotenv from 'dotenv'

class Config {
    constructor() {
        dotenv.config()

        if (process.env.NODE_ENV === 'test') {
            dotenv.config({
                path: path.resolve(process.cwd(), '.env.test'),
                override: true
            })
        }
    }

    config() {
        return {
            env: this.env(),
            isTest: this.env() === 'test'
        }
    }

    private env(): string {
        let env = 'prod'

        if (process.env.NODE_ENV === 'test' || process.env.APP_ENV === 'test') {
            env = 'test'
        }

        return env
    }
}

export default new Config()