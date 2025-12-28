export class ApplicationException extends Error {
    public code = 'APPLICATION_ERROR';
    public error: any;
    
    constructor(message: string, error: any = null) {
        super(message);
        this.error = error;
    }
}