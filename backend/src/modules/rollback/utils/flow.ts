import { ErrorType } from "@/modules/rollback/types/ErrorType";
import { Step } from "@/modules/rollback/types/Step";
import { CriticalException } from "../../util/exceptions/CriticalException";
import { ApplicationException } from "../../util/exceptions/ApplicationException";
import { originalError } from "./error";

export class FlowObject {
    private steps: Step[] = [];


    step(errorType: ErrorType | null | ((() => Promise<any>)), callback: ((result: any) => Promise<any>) | null = null) {
        if (typeof errorType === 'function') {
            callback = errorType as () => Promise<any>;
            errorType = originalError();
        }

        if (!errorType) {
            errorType = originalError();
        }

        if (!callback) {
            throw new CriticalException('No callback provided');
        }

        this.steps.push({ step: callback, errorType });
        return this;
    }

    rollback(callback: () => Promise<void>) {
        if (this.steps.length === 0) {
            throw new CriticalException('No step to rollback');
        }

        const lastStep = this.steps[this.steps.length - 1];

        if (lastStep.rollback) {
            throw new CriticalException('Rollback already defined');
        }

        lastStep.rollback = callback;
        return this;
    }

    async run() {
        let result: any = null;

        for (const step of this.steps) {
            try {
                result = await step.step(result);
            } catch (error) {
                const previousSteps = this.steps.slice(0, this.steps.indexOf(step)).reverse();
                for (const previousStep of previousSteps) {
                    if (previousStep.rollback) {
                        await previousStep.rollback();
                    }
                }
                
                this.handleError(error, step.errorType);
            }
        }

        return result
    }

    private handleError(error: any, errorType: ErrorType) {
        let message = errorType.message;

        if (errorType.logMessageFromOriginalError) {
            if (error && typeof error === "object" && "message" in error && typeof error.message === "string") {
                message = error.message;
            }
        }

        if (errorType.type === 'CRITICAL') {
            throw new CriticalException(message ?? 'Unknown error occurred', error);
        }
        throw new ApplicationException(message ?? 'Unknown error occurred', errorType.logAsCritical ? error : null);
    }
}

export const flow = () => {
    return new FlowObject();
}

export const simpleFlow = async (callback: () => Promise<any>) => {
    return await flow()
        .step(originalError(), async () => {
            return await callback();
        })
        .run();
}