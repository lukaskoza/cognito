import { CognitoJwtVerifier } from "aws-jwt-verify";
import { ApplicationException } from "../../util/exceptions/ApplicationException";

export class TokenVerification {

    parse(authHeader: string | undefined): string {
        if (!authHeader) {
            throw new ApplicationException("Access token is required")
        }
        const bearerToken = authHeader.substring(7)
        if (!bearerToken) {
            throw new ApplicationException("Bearer token in wrong format")
        }

        return bearerToken;
    }

    async verify(token: string, tokenUse: "id" | "access" = "access") {
        if (!process.env.COGNITO_USER_POOL_ID) {
            throw new ApplicationException("COGNITO_USER_POOL_ID is not set")
        }
        if (!process.env.COGNITO_CLIENT_ID) {
            throw new ApplicationException("COGNITO_CLIENT_ID is not set")
        }

        const verifier = CognitoJwtVerifier.create({
            userPoolId: process.env.COGNITO_USER_POOL_ID,
            clientId: process.env.COGNITO_CLIENT_ID,
            tokenUse: tokenUse,
        })
        
        try {
            return await verifier.verify(token);
        } catch (error) {
            throw new ApplicationException("Invalid access token")
        }
    }

    decode(token: string): any {
        try {
            const parts = token.split('.');
            if (parts.length !== 3) {
                throw new ApplicationException("Invalid token format");
            }

            const payload = parts[1];
            const paddedPayload = payload + '='.repeat((4 - payload.length % 4) % 4);
            const decodedPayload = JSON.parse(Buffer.from(paddedPayload, 'base64').toString());
            
            return decodedPayload;
        } catch (error) {
            throw new ApplicationException("Failed to decode token payload");
        }
    }
    
}


export const tokenVerification = new TokenVerification();