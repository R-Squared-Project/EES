import Entity from "context/Core/Domain/Entity";

export default class InternalContract extends Entity {
    public constructor(
        private _internalId: string
    ) {
        super();
    }

    get internalId(): string {
        return this._internalId;
    }

}
