resource "aws_cognito_user_pool" "pool" {
  name = "chesster"

  sign_in_policy {
    allowed_first_auth_factors = ["PASSWORD"]
  }

  admin_create_user_config {
    allow_admin_create_user_only = false
  }
}

resource "aws_cognito_user_pool_client" "client" {
  name         = "chesster-client"
  user_pool_id = aws_cognito_user_pool.pool.id

  refresh_token_validity = 31
  id_token_validity = 60
  access_token_validity = 60

  token_validity_units {
    refresh_token = "days"
    id_token = "minutes"
    access_token = "minutes"
  }

  generate_secret = true
  explicit_auth_flows = [
    "ALLOW_USER_PASSWORD_AUTH",
    "ALLOW_ADMIN_USER_PASSWORD_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH"
  ]
}