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
  id_token_validity = 5
  access_token_validity = 5

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

output "cognito_env_vars" {
  value = {
    COGNITO_USER_POOL_ID  = aws_cognito_user_pool.pool.id
    COGNITO_CLIENT_ID     = aws_cognito_user_pool_client.client.id
    COGNITO_CLIENT_SECRET = aws_cognito_user_pool_client.client.client_secret
  }
  sensitive = true
}








# resource "aws_cognito_user_pool" "pool" {
#   name = "chesster"

#   # Use email as the primary username
#   username_attributes = ["email"]

#   # Auto-verify email addresses
#   auto_verified_attributes = ["email"]

#   schema {
#     attribute_data_type = "String"
#     name = "email"
#     required = true
#     mutable = true
#   }
#   lifecycle {
#     ignore_changes = [schema]
#   }

#   password_policy {
#     minimum_length = 8
#     require_lowercase = true
#     require_numbers = true
#     require_symbols = false
#     require_uppercase = false
#   }

#   admin_create_user_config {
#     allow_admin_create_user_only = false
#   }

#   verification_message_template {
#     default_email_option = "CONFIRM_WITH_CODE"
#     email_subject = "Verify your email for Chesster"
#     email_message = "Your verification code is {####}. Please enter this code to verify your email address."
#   }

#   account_recovery_setting {
#     recovery_mechanism {
#       name     = "verified_email"
#       priority = 1
#     }
#   }
# }

# resource "aws_cognito_user_pool_client" "client" {
#   name         = "chesster-client"
#   user_pool_id = aws_cognito_user_pool.pool.id

#   generate_secret = true
#   explicit_auth_flows = [
#     "ALLOW_USER_PASSWORD_AUTH",
#     "ALLOW_USER_SRP_AUTH"
#   ]
# }


# output "cognito_env_vars" {
#   value = {
#     COGNITO_USER_POOL_ID = aws_cognito_user_pool.pool.id
#     COGNITO_CLIENT_ID    = aws_cognito_user_pool_client.client.id
#     COGNITO_CLIENT_SECRET = aws_cognito_user_pool_client.client.client_secret
#   }
#   sensitive = true 
# }
