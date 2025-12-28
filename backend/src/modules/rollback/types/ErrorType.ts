export type ErrorType = {
    type: 'CRITICAL' | 'APPLICATION';
    message: string | null;
    logMessageFromOriginalError: boolean;
    logAsCritical: boolean;
}