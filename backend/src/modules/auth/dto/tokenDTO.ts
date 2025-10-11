import { InitiateAuthCommandOutput } from "@aws-sdk/client-cognito-identity-provider";
import { t } from "elysia";
import { BaseDTO } from "../../util/dto/baseDTO";


export const tokenSchema = t.Object({
    accessToken: t.Optional(t.String()),
    idToken: t.Optional(t.String()),
    refreshToken: t.Optional(t.String()),
})


export class TokenDTO extends BaseDTO<InitiateAuthCommandOutput, typeof tokenSchema.static> {
    schema = tokenSchema;
    async convert(resource: InitiateAuthCommandOutput) {
        return {
            accessToken: resource.AuthenticationResult?.AccessToken,
            idToken: resource.AuthenticationResult?.IdToken,
            refreshToken: resource.AuthenticationResult?.RefreshToken,
        }
    }
}