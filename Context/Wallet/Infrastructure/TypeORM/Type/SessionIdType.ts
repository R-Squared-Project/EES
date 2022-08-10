import {EntitySchemaColumnOptions} from "typeorm/entity-schema/EntitySchemaColumnOptions";
import SessionId from "../../../Domain/SessionId";

const SessionIdType: EntitySchemaColumnOptions = {
    type: String,
    name: 'session_id',
    transformer: {
        to(sessionId: SessionId): string {
            return sessionId.value
        },
        from(value: string): SessionId {
            return SessionId.create(value).getValue() as SessionId
        }
    }
}

export default SessionIdType