import {shallowEqual} from 'shallow-equal-object';

export interface ValueObjectProps {
    [index: string]: any;
}

export default abstract class ValueObject<T extends ValueObjectProps> {
    public readonly props: T;

    constructor(props: T) {
        this.props = Object.freeze(props);
    }

    get value(): any {
        return this.props.value;
    }

    public equals(vo?: ValueObject<T>): boolean {
        if (vo === null || vo === undefined) {
            return false;
        }
        if (vo.props === undefined) {
            return false;
        }
        return shallowEqual(this.props, vo.props)
    }
}
