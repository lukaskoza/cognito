import { Elysia } from "elysia";
import { authService } from "@/modules/auth/services/AuthService";
import { loginBody, registerBody, refreshBody } from "@/modules/auth/model";
import { InitiateAuthCommandOutput } from "@aws-sdk/client-cognito-identity-provider";
import { tokenVerification } from "@/modules/auth/services/TokenVerification";
import { TokenDTO } from "@/modules/auth/dto/tokenDTO";
import { SuccessDTO } from "@/modules/util/dto/successDTO";
import { authentificate } from "@/modules/auth/middlewares/authentificate";
import { ProfileDTO } from "@/modules/auth/dto/profileDTO";

export const authModule = new Elysia({prefix: "/auth"})

  .post("/register", async ({ body }) => {
    const result = await authService.register(body.email, body.password) as InitiateAuthCommandOutput;
    return await TokenDTO.make(result, 'User registered successfully');
    
  }, { body: registerBody, response: TokenDTO.type() })
  
  .post("/login", async ({ body }) => {
    const result = await authService.login(body.email, body.password) as InitiateAuthCommandOutput;
    return await TokenDTO.make(result, 'User logged in successfully');
  }, { body: loginBody, response: TokenDTO.type() })


  .post("/logout", async ({ headers }: { headers: any }) => {
    const refreshToken = tokenVerification.parse(headers.authorization)
    await authService.logout(refreshToken)
    
    return await SuccessDTO.make('User logged out successfully');
  }, { response: SuccessDTO.type() })

  .post("/refresh", async ({ body, headers }) => {
    const accessToken = tokenVerification.parse(headers.authorization)
    const payload = tokenVerification.decode(accessToken)
    console.log(payload)

    const result = await authService.refreshToken(payload.username as string, body.refreshToken)
    return await TokenDTO.make(result, 'Token refreshed successfully');
  }, { body: refreshBody, response: TokenDTO.type() })

  // Protected routes
  .use(authentificate)
  .get('/profile', async ({ userPayload }) => {
    const result = await authService.getUser(userPayload.accessToken)
    return await ProfileDTO.make(result, 'Profile fetched successfully');
  }, { response: ProfileDTO.type() })
