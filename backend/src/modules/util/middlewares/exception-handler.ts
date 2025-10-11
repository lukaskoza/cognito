import { Elysia } from "elysia";
import { ApplicationException } from "../exceptions/ApplicationException";

export const exceptionHandler = new Elysia()
    .onError({as: 'scoped'}, ({ error }) => {
        if (error instanceof ApplicationException) {
            return {
                status: 'ERROR',
                message: error.message
            }
        }
    });