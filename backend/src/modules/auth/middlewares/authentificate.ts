import { Elysia } from "elysia";
import { tokenVerification } from "@/modules/auth/services/TokenVerification";
import { UserPayload } from "@/modules/auth/types/user-payload";

export const authentificate = new Elysia()
    .derive({as: 'scoped'}, async ({ headers }) => {
        const accessToken = tokenVerification.parse(headers.authorization)
        const payload = tokenVerification.decode(accessToken)
        
        return {
            userPayload: {
                username: payload.username,
                accessToken: accessToken,
            } as UserPayload
        }
    })