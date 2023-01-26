import {UseCaseError} from "context/Core/Logic/UseCaseError";

export class BlockNotExists extends UseCaseError {
    constructor(number: number) {
        super(`The block with number ${number} was not found.`)
    }
}

export class FromBlockLargerThanToBlock extends UseCaseError {
    constructor(fromBlockNumber: number, toBlockNumber: number) {
        super(`lastIrreversibleBlockNumber ${fromBlockNumber} less or equal than lastProcessedBlockNumber ${toBlockNumber}.`)
    }
}

export class FromBlockHashEqualsToBlockHash extends UseCaseError {
    constructor(hash: string, number: number) {
        super(`fromBlock hash and toBlock hash are equal: ${hash}, number: ${number}.`)
    }
}
