import UniqueEntityID from './UniqueEntityID';

const isEntity = (v: any): v is Entity => {
    return v instanceof Entity;
};

export default abstract class Entity {
    protected _id: UniqueEntityID;

    constructor(id?: UniqueEntityID) {
        this._id = id ? id : new UniqueEntityID();
    }

    get idString(): string {
        return this._id.toString()
    }

    set idString(id: string) {
        this._id = new UniqueEntityID(id)
    }

    public equals(object?: Entity): boolean {
        if (object === null || object === undefined) {
            return false;
        }

        if (this === object) {
            return true;
        }

        if (!isEntity(object)) {
            return false;
        }

        return this._id.equals(object._id);
    }
}
