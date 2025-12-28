import { ErrorType } from "./ErrorType";

export type Step = {
    step: (result: any) => Promise<any>;
    rollback?: () => Promise<void>;
    errorType: ErrorType;
}