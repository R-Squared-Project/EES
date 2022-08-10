import DepositModel from '../../../Domain/Deposit'
import DepositDBModel from '../Entity/Deposit'
import SessionId from "../../../Domain/SessionId";
import UniqueEntityID from "../../../../Core/Domain/UniqueEntityID";

export default class Deposit {
    static toPersistence(deposit: DepositModel): DepositDBModel {
        const depositDb = new DepositDBModel()
        depositDb.id = deposit.id.toValue()
        depositDb.sessionId = deposit.sessionId.value
        depositDb.status = deposit.status
        depositDb.txHash = deposit.txHash
        depositDb.revpopAccount = deposit.revpopAccount
        return depositDb
    }

    static toDomain(depositDb: DepositDBModel): DepositModel {
        const sessionIdOrError = SessionId.create(depositDb.sessionId as string)

        const deposit = new DepositModel(
            sessionIdOrError.getValue() as SessionId,
            new UniqueEntityID(depositDb.id as string)
        )

        return deposit
    }
}