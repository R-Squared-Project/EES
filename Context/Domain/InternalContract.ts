import Entity from "context/Core/Domain/Entity";

export default class InternalContract extends Entity {
    public constructor(
        private _internalId: string,
        private _externalId: string
    ) {
        super();
    }

    get internalId(): string {
        return this._internalId;
    }

    get externalId(): string {
        return this._externalId;
    }
}
