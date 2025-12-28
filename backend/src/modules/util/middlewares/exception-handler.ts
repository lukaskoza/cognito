import { Elysia } from "elysia";
import { ApplicationException } from "@/modules/util/exceptions/ApplicationException";
import { CriticalException } from "../exceptions/CriticalException";
import { logger } from '@/modules/logger/services/Logger';
import env from "@/config/env";

export const exceptionHandler = new Elysia()
    .onError({as: 'scoped'}, ({ error, code, set }) => {
        
        if (code === 'NOT_FOUND') {
            set.status = 404;
            return {
                status: 'ERROR',
                message: 'Route not found'
            }
        }

        if (error instanceof ApplicationException) {
            return {
                status: 'ERROR',
                message: error.message
            }
        }

        if (error instanceof CriticalException) {
            logger.critical(error.message, {
                type: 'CriticalException',
                stack: error.stack,
            });
            return {
                status: 'ERROR',
                message: 'Critical error occurred'
            }
        }

        logger.error('Unknown error occurred', {
            type: 'UnknownError',
            message: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
        });
        
        if (env.NODE_ENV !== 'development') {
            return {
                status: 'ERROR',
                message: 'Unknown error occurred'
            }
        }
        throw error;
    });