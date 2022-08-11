import ValueObject from "../../Core/Domain/ValueObject";
import {Result} from "../../Core";

interface SessionIdProps {
    value: string;
}

export default class SessionId extends ValueObject<SessionIdProps> {
    private constructor(props: SessionIdProps) {
        super(props);
    }

    public static create(sessionId: string): Result<SessionId> {
        if (sessionId.length === 0) {
            return Result.fail<SessionId>('Must provide a sessionId')
        }

        return Result.ok<SessionId>(new SessionId({value: sessionId}))
    }
}