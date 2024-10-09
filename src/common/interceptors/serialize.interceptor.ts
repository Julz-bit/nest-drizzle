import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from 'rxjs/operators';

@Injectable()
export class SerializeInterceptor implements NestInterceptor {
    constructor(private readonly propertiesToRemove: string[]) { }

    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
        return next.handle().pipe(
            map((data) => {
                if (Array.isArray(data)) {
                    // Handle array of objects
                    return data.map(item => this.removeProperties(item));
                } else if (typeof data === 'object' && data !== null) {
                    // Handle single object
                    return this.removeProperties(data);
                }
                return data;
            })
        )
    }

    private removeProperties(data: any): any {
        if (typeof data === 'object' && data !== null) {
            this.propertiesToRemove.forEach((property) => {
                if (data.hasOwnProperty(property)) {
                    delete data[property];
                }
            });
        }
        return data;
    }
}