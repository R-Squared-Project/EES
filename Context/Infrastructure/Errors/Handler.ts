export default class Handler {
    constructor(
        private prefix: string
    ) {}

    public handle(e: Error) {
        console.log(`[${this.prefix}]: ${e.message}`);
    }
}