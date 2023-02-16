import RepositoryInterface from "../../Domain/RepositoryInterface";

export default class Repository implements RepositoryInterface {
    private settings: {
        [key: string]: string
    } = {}

    async load(name: string): Promise<string | null> {
        if (name in this.settings) {
            return this.settings[name]
        }

        return null
    }

    async save(name: string, value: any): Promise<void> {
        this.settings[name] = value
    }
}
