import { ErrorType } from "@/modules/rollback/types/ErrorType";

export const criticalError = (message: string, logAsCritical: boolean = false) => {
    return {
        type: 'CRITICAL',
        logAsCritical,
        message,
        logMessageFromOriginalError: false,
    } as ErrorType;
}

export const appError = (message: string, logAsCritical: boolean = false) => {
    return {
        type: 'APPLICATION',
        logAsCritical,
        message,
        logMessageFromOriginalError: false
    } as ErrorType;
}


export const originalError = () =>  {
    return {
        type: 'APPLICATION',
        logAsCritical: false,
        message: null,
        logMessageFromOriginalError: true,
    } as ErrorType;
}