import {v4} from 'uuid';
import Identifier from './Identifier'

export default class UniqueEntityID extends Identifier<string> {
    constructor(id?: string) {
        super(id ? id : v4())
    }
}