import {Dayjs} from "dayjs";
import UniqueEntityID from "context/Core/Domain/UniqueEntityID";
import Contract from "context/ExternalBlockchain/Contract";
import Entity from "context/Core/Domain/Entity";
import ExternalContractValidator from "context/Domain/Validation/ExternalContractValidator";

export default class ExternalContract extends Entity {
    private _withdrawn: boolean
    private _refunded: boolean
    private _preimage: string

    constructor(
        contractId: UniqueEntityID,
        private _sender: string,
        private _receiver: string,
        private _value: string,
        private _hashLock: string,
        private _timeLock: number,
        private _createdAt: Dayjs
    ) {
        super(contractId);
        this._withdrawn = false
        this._refunded = false
        this._preimage = ''
    }

    static fromContract(contract: Contract) {
        new ExternalContractValidator(contract).validate()

        const externalContract = new ExternalContract(
            new UniqueEntityID(contract.contractId),
            contract.sender,
            contract.receiver,
            contract.value,
            contract.hashLock,
            contract.timeLock,
            contract.createdAt
        )
        return externalContract
    }
}
