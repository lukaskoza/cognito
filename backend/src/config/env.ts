// src/config/env.ts
import { cleanEnv, str, num, bool } from 'envalid';

export default cleanEnv(process.env, {
  // APPLICATION
  PORT: num({ default: 3000 }),
  DATABASE_URL: str(),

  // AWS
  AWS_REGION: str(),
  COGNITO_USER_POOL_ID: str(),
  COGNITO_CLIENT_ID: str(),
  COGNITO_CLIENT_SECRET: str(),
  AWS_ACCESS_KEY_ID: str(),
  AWS_SECRET_ACCESS_KEY: str(),

  // CloudWatch (optional - only needed when CLOUDWATCH_ENABLED=true)
  CLOUDWATCH_ENABLED: bool({ default: false }),
  CLOUDWATCH_LOG_GROUP: str({ default: undefined}),

  // NODE_ENV
  NODE_ENV: str({ default: 'production' }),
});