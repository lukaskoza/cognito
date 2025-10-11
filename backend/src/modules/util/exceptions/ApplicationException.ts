export class ApplicationException extends Error {
    public code = 'APPLICATION_ERROR';
    
    constructor(message: string) {
        super(message);
    }
}