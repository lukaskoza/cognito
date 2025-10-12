import { GetUserCommandOutput } from "@aws-sdk/client-cognito-identity-provider";
import { t } from "elysia";
import { BaseDTO } from "@/modules/util/dto/baseDTO";
import { ApplicationException } from "@/modules/util/exceptions/ApplicationException";


export const profileSchema = t.Object({
    username: t.String(),
    sub: t.String(),
})


export class ProfileDTO extends BaseDTO<GetUserCommandOutput, typeof profileSchema.static> {
    schema = profileSchema;
    
    async convert(resource: GetUserCommandOutput) {
        if (!resource.Username) {
            throw new ApplicationException("Username was not found");
        }

        const sub = resource.UserAttributes?.find(attr => attr.Name === "sub")?.Value;
        if (!sub) {
            throw new ApplicationException("Sub was not found");
        }
        
        return {
            username: resource.Username,
            sub,
        }
    }
}