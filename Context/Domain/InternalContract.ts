import Entity from "context/Core/Domain/Entity";

export default class InternalContract extends Entity {
    private _status: number;
    private _createdAt: Date = new Date();

    public constructor(private _internalId: string) {
        super();

        this._status = 1;
    }

    get internalId(): string {
        return this._internalId;
    }

    get createdAt(): Date {
        return this._createdAt;
    }

    set createdAt(value: Date) {
        this._createdAt = value;
    }
}
