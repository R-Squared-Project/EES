import Setting from "context/Setting/Setting";

export default interface RepositoryInterface {
    load: (name: string) => Promise<string | null>
    save: (name: string, value: any) => void
}
