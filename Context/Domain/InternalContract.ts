import Entity from "context/Core/Domain/Entity";

export default class InternalContract extends Entity {
    private _status: number

    public constructor(
        private _internalId: string
    ) {
        super();

        this._status = 1
    }

    get internalId(): string {
        return this._internalId;
    }

}
