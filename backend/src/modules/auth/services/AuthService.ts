import { CognitoIdentityProviderClient, SignUpCommand, InitiateAuthCommand, AdminConfirmSignUpCommand, AdminDeleteUserCommand, RevokeTokenCommand, GetUserCommand, InitiateAuthCommandOutput, RevokeTokenCommandOutput, GetUserCommandOutput, AdminDeleteUserCommandOutput, AdminConfirmSignUpCommandOutput } from "@aws-sdk/client-cognito-identity-provider";
import crypto from "crypto";
import env from "@/config/env";
import { userRepository } from "../repositories/UserRepository";
import { flow, appError, originalError, simpleFlow } from "@/modules/rollback";
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


        const result = await flow()
            .step(originalError(), async () => {
                return await this.cognitoClient.send(command);
            })
            .rollback(async () => {
                await this.deleteUser(email);
            })
            .step(appError('Registration failed', true), async () => {
                return await userRepository.create(email, email);
            })
            .rollback(async () => {
                await userRepository.delete(email);
            })
            .step(appError('Registration failed', true), async () => {
                await this.confirmUser(email);
                return await this.login(email, password);
            })
            .run()
        
        return result as InitiateAuthCommandOutput;

    }

    async deleteUser(email: string): Promise<AdminDeleteUserCommandOutput> {
        const command = new AdminDeleteUserCommand({
            Username: email,
            UserPoolId: this.userPoolId
        })
        return await simpleFlow(async () => {
            return await this.cognitoClient.send(command);
        });
    }

    async confirmUser(email: string): Promise<AdminConfirmSignUpCommandOutput> {
        const command = new AdminConfirmSignUpCommand({
            Username: email,
            UserPoolId: this.userPoolId
        })

        return await simpleFlow(async () => {
            return await this.cognitoClient.send(command);
        });
    }


    async login(email: string, password: string): Promise<InitiateAuthCommandOutput> {
        const command = new InitiateAuthCommand({
            AuthFlow: 'USER_PASSWORD_AUTH',
            ClientId: this.clientId,
            AuthParameters: {
                USERNAME: email,
                PASSWORD: password,
                SECRET_HASH: this.calculateSecretHash(email)
            }
        });

        return await simpleFlow(async () => {
            return await this.cognitoClient.send(command);
        });
    }


    async logout(refreshToken: string): Promise<RevokeTokenCommandOutput> {
        const command = new RevokeTokenCommand({
            Token: refreshToken,
            ClientId: this.clientId,
            ClientSecret: this.clientSecret,
        });

        return await simpleFlow(async () => {
            return await this.cognitoClient.send(command);
        });
    }

    async refreshToken(username: string, refreshToken: string): Promise<InitiateAuthCommandOutput> {
        const command = new InitiateAuthCommand({
            AuthFlow: 'REFRESH_TOKEN_AUTH',
            ClientId: this.clientId,
            AuthParameters: {
                REFRESH_TOKEN: refreshToken,
                SECRET_HASH: this.calculateSecretHash(username),
            }
        });

        return await simpleFlow(async () => {
            return await this.cognitoClient.send(command);
        })
    }

    async getUser(accessToken: string): Promise<GetUserCommandOutput> {
        const command = new GetUserCommand({
            AccessToken: accessToken,
        });

        return await simpleFlow(async () => {
            return await this.cognitoClient.send(command);
        })
    }
}

export const authService = new AuthService();