import { CognitoIdentityProviderClient, SignUpCommand, InitiateAuthCommand, AdminConfirmSignUpCommand, AdminDeleteUserCommand, RevokeTokenCommand } from "@aws-sdk/client-cognito-identity-provider";
import crypto from "crypto";
import { ApplicationException } from "../../util/exceptions/ApplicationException";
import env from "../../../config/env";
class AuthService {
    private cognitoClient: CognitoIdentityProviderClient;
    private userPoolId: string;
    private clientId: string;
    private clientSecret: string;

    constructor() {
        this.cognitoClient = new CognitoIdentityProviderClient({
            region: env.AWS_REGION,
            credentials: {
                accessKeyId: env.AWS_ACCESS_KEY_ID,
                secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
            }
        });
        this.userPoolId = env.COGNITO_USER_POOL_ID;
        this.clientId = env.COGNITO_CLIENT_ID;
        this.clientSecret = env.COGNITO_CLIENT_SECRET;
    }

    private calculateSecretHash(value: string): string {
        return crypto
            .createHmac('SHA256', this.clientSecret)
            .update(value + this.clientId)
            .digest('base64');
    }

    async register(email: string, password: string) {
        const command = new SignUpCommand({
            ClientId: this.clientId,
            Username: email,
            Password: password,
            SecretHash: this.calculateSecretHash(email),
        });

        try {
            await this.cognitoClient.send(command);
            await this.confirmUser(email)
            return await this.login(email, password)
        } catch (error) {
            try {
                await this.deleteUser(email)
            } catch (error) {
                // ignore error and throw original error, this would confuse the user because this is just rollback mechanism
            }
            this.handleCognitoError(error);
        }
    }

    async deleteUser(email: string) {
        const command = new AdminDeleteUserCommand({
            Username: email,
            UserPoolId: this.userPoolId
        })
        try {
            return await this.cognitoClient.send(command);
        } catch (error) {
            this.handleCognitoError(error);
        }
    }

    async confirmUser(email: string) {
        const command = new AdminConfirmSignUpCommand({
            Username: email,
            UserPoolId: this.userPoolId
        })

        return await this.cognitoClient.send(command);
    }


    async login(email: string, password: string) {
        const command = new InitiateAuthCommand({
            AuthFlow: 'USER_PASSWORD_AUTH',
            ClientId: this.clientId,
            AuthParameters: {
                USERNAME: email,
                PASSWORD: password,
                SECRET_HASH: this.calculateSecretHash(email)
            }
        });

        try {
            return await this.cognitoClient.send(command);
        } catch (error) {
            this.handleCognitoError(error);
        }
    }


    async logout(refreshToken: string) {
        const command = new RevokeTokenCommand({
            Token: refreshToken,
            ClientId: this.clientId,
            ClientSecret: this.clientSecret,
        });
        try {
            return await this.cognitoClient.send(command);
        } catch (error) {
            this.handleCognitoError(error);
        }
    }

    async refreshToken(username: string, refreshToken: string) {
        const command = new InitiateAuthCommand({
            AuthFlow: 'REFRESH_TOKEN_AUTH',
            ClientId: this.clientId,
            AuthParameters: {
                REFRESH_TOKEN: refreshToken,
                SECRET_HASH: this.calculateSecretHash(username),
            }
        });

        try {
            return await this.cognitoClient.send(command);
        } catch (error) {
            this.handleCognitoError(error);
        }
    }


    private handleCognitoError(error: any) {
        if (error instanceof ApplicationException) throw error
        if (error && typeof error === "object" && "message" in error && typeof error.message === "string") {
            throw new ApplicationException(error.message);
        }
        throw error;
    }
}

export const authService = new AuthService();