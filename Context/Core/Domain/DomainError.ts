export abstract class DomainError extends Error {
    public readonly message: string;

    constructor(message: string) {
        super(message)
        this.message = message;
    }
}
