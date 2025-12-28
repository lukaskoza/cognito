import { CriticalException } from "@/modules/util/exceptions/CriticalException";
import { ApplicationException } from "../exceptions/ApplicationException";


type Step = {
    step: (result: any) => Promise<any>;
    rollback?: () => Promise<void>;
    errorType: ErrorType | null;
}

type FlowObject = {
    step: (errorType: ErrorType | null | ((() => Promise<any>)), callback?: (() => Promise<any>) | null) => FlowObject;
    rollback: (callback: () => Promise<void>) => FlowObject;
}

type ErrorType = {
    type: 'CRITICAL' | 'APPLICATION';
    message: string;
}


export const criticalError = (message: string) => {
    return {
        type: 'CRITICAL',
        message,
    } as ErrorType;
}

export const appError = (message: string) => {
    return {
        type: 'APPLICATION',
        message,
    } as ErrorType;
}



export const flow = async (flowChain: (flow: FlowObject) => Promise<any>) => {
    const steps: Step[] = [];


    const flowObject: FlowObject = {
        step: (errorType: ErrorType | null | ((() => Promise<void>)), callback: ((result: any) => Promise<any>) | null = null) => {
            if (typeof errorType === 'function') {
                callback = errorType as () => Promise<void>;
                errorType = null;
            }

            if (!callback) {
                throw new CriticalException('No callback provided');
            }

            steps.push({ step: callback, errorType });
            return flowObject;
        },
        rollback: (callback: () => Promise<void>) => {
            if (steps.length === 0) {
                throw new CriticalException('No step to rollback');
            }

            const lastStep = steps[steps.length - 1];

            if (lastStep.rollback) {
                throw new CriticalException('Rollback already defined');
            }

            lastStep.rollback = callback;
            return flowObject;
        }
    } as FlowObject;

    flowChain(flowObject);
    let result: any = null;

    for (const step of steps) {
        try {
            result = await step.step(result);
        } catch (error) {
            const previousSteps = steps.slice(0, steps.indexOf(step)).reverse();
            for (const previousStep of previousSteps) {
                if (previousStep.rollback) {
                    await previousStep.rollback();
                }
            }
            if (step.errorType) {
                if (step.errorType.type === 'CRITICAL') {
                    throw new CriticalException(step.errorType.message, error);
                }
                throw new ApplicationException(step.errorType.message);
            } else {
                throw error;
            }
        }
    }

    return result

};