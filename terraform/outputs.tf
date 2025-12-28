output "backend_env_vars" {
  value = merge(
    module.auth_backend.cognito_env_vars,
    module.auth_backend.iam_env_vars,
    module.auth_backend.cloudwatch_env_vars,
    {
      AWS_REGION = var.aws_region
    }
  )
  sensitive = true
}