import { t } from "elysia";
import { BaseDTO } from "@/modules/util/dto/baseDTO";

export const successSchema = t.Object({})
export type SuccessSchema = typeof successSchema.static;

export class SuccessDTO extends BaseDTO<null | undefined, SuccessSchema> {
    schema = successSchema;
    async convert(resource: null | undefined) {
        return {}
    }

    static async make(message: string | null = null) {
        const instance = new (this as any )();
        const data = await instance.convert(null)
        
        return this.wrapData(data, message);
    }

}