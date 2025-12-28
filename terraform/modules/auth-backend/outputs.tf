output "cognito_env_vars" {
  value = {
    COGNITO_USER_POOL_ID  = aws_cognito_user_pool.pool.id
    COGNITO_CLIENT_ID     = aws_cognito_user_pool_client.client.id
    COGNITO_CLIENT_SECRET = aws_cognito_user_pool_client.client.client_secret
  }
  sensitive = true
}

output "iam_env_vars" {
  value = {
    AWS_ACCESS_KEY_ID  = aws_iam_access_key.backend_service.id
    AWS_SECRET_ACCESS_KEY     = aws_iam_access_key.backend_service.secret
  }
  sensitive = true
}

output "cloudwatch_env_vars" {
  description = "CloudWatch environment variables for backend application"
  value = {
    CLOUDWATCH_LOG_GROUP  = aws_cloudwatch_log_group.backend_app.name
    CLOUDWATCH_AWS_REGION = data.aws_region.current.name
  }
}