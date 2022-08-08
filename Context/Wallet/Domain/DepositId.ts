import Entity from "../../Core/Domain/Entity";
import UniqueEntityID from "../../Core/Domain/UniqueEntityID";

export default class DepositId extends Entity {
    get id(): UniqueEntityID {
        return this._id;
    }

    private constructor(id?: UniqueEntityID) {
        super(id)
    }

    public static create(id?: UniqueEntityID): DepositId {
        return new DepositId(id);
    }
}