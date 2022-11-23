export class AppError extends Error {
    public constructor() {
        super(`An unexpected error occurred.`)
    }
}
