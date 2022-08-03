import {Injectable, NestInterceptor, ExecutionContext, CallHandler} from '@nestjs/common';
import {map, Observable} from 'rxjs';
import SuccessResponse from "../Response/SuccessResponse";

export interface Response<T> {
    data: T;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next
            .handle()
            .pipe(map(value => {
                if (value instanceof SuccessResponse) {
                    if (null === value.data) {
                        return null
                    } else {
                        return {
                            data: value.data
                        }
                    }
                }

                return value
            }));
    }
}