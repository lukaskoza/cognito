export class CriticalException extends Error {
    public code = 'CRITICAL_ERROR';
    public error: any;
    
    constructor(message: string, error: any = null) {
        super(message);
        this.error = error;
    }
}