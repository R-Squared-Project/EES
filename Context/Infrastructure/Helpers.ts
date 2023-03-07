export function ensureHasPrefix(hash: string): string {
    if (hash.substring(0, 2) !== "0x") {
        hash = "0x" + hash
    }

    return hash
}