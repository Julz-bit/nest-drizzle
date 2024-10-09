import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter } from "@nestjs/common";
import { ValidationError } from "class-validator";
import { FastifyReply } from 'fastify';

@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
    catch(exception: BadRequestException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const reply = ctx.getResponse<FastifyReply>();
        const status = exception.getStatus();
        const validationErrors = exception.getResponse() as any;
        if (validationErrors && Array.isArray(validationErrors.message)) {
            const formattedErrors = this.formatErrors(validationErrors.message);
            reply
                .status(status)
                .send({
                    statusCode: status,
                    message: formattedErrors,
                });
        } else {
            reply.status(status).send(exception.getResponse());
        }
    }

    private formatErrors(errors: ValidationError[], parentPath: string = ''): Record<string, string>[] {
        let formattedErrors: Record<string, string>[] = [];
        for (const error of errors) {
            if (error.constraints) {
                const errorMessages = Object.values(error.constraints);
                const fullPath = parentPath ? `${parentPath}.${error.property}` : error.property;
                formattedErrors.push({ [fullPath]: errorMessages[0] });
            }

            if (error.children && error.children.length > 0) {
                const childErrors = this.formatErrors(error.children, error.property);
                formattedErrors = formattedErrors.concat(childErrors);
            }
        }
        return formattedErrors;
    }
}
