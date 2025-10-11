import { t } from "elysia";
import { TObject } from "@sinclair/typebox";


export abstract class BaseDTO<RESOURCE, RESPONSE> {
    abstract schema: TObject

    static async make(resource: any, message: string | null = null) {
        const instance = new (this as any )();
        const data = await instance.convert(resource)
        
        return this.wrapData(data, message);
    }

    static async collect(resources: any[], message: string | null) {
        const data = resources.map(async (resource) => {
            const instance = new (this as any )();
            return await instance.convert(resource)
        })
        return this.wrapData(data, message);
    }

    static type() {
        const instance = new (this as any )();
        return instance.getType()
    }

    static types() {
        const instance = new (this as any )();
        return instance.getTypes()
    }


    static wrapData(data: any, message: string | null) {
        return {
            status: 'SUCCESS',
            message: message ?? 'Operation successful',
            data: data
        }
    }


    abstract convert(resource: RESOURCE): Promise<RESPONSE>;


    getType() {
        return t.Object({
            status: t.String(),
            message: t.String(),
            data: this.schema
        })
    }


    getTypes() {
        return t.Array(this.getType())
    }
}