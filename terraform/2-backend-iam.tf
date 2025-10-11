resource "aws_iam_user" "backend_service" {
  name = "chesster-backend-service"
  path = "/service-accounts/"

}

resource "aws_iam_access_key" "backend_service" {
  user = aws_iam_user.backend_service.name
}

resource "aws_iam_policy" "cognito_admin" {
  name        = "CognitoAdminOperations"
  description = "Allow admin operations on Cognito user pool"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "cognito-idp:AdminConfirmSignUp",
          "cognito-idp:AdminDeleteUser"
        ]
        Resource = aws_cognito_user_pool.pool.arn
      }
    ]
  })
}

resource "aws_iam_user_policy_attachment" "backend_service_cognito" {
  user       = aws_iam_user.backend_service.name
  policy_arn = aws_iam_policy.cognito_admin.arn
}


output "iam_env_vars" {
  value = {
    AWS_ACCESS_KEY_ID  = aws_iam_access_key.backend_service.id
    AWS_SECRET_ACCESS_KEY     = aws_iam_access_key.backend_service.secret
  }
  sensitive = true
}