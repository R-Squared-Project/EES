export default class Setting {
    id!: number
    name: string
    value: string

    constructor(
       name: string,
       value: string
    ) {
        this.name = name
        this.value = value
    }
}
