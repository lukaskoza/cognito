terraform {
  backend "s3" {
    bucket         = "chesster-terraform-state-bucket"
    key            = "apps/conginto-auth/terraform.tfstate"

    dynamodb_table = "chesster-terraform-locks"
    region         = "eu-central-1"
    encrypt        = true

    profile        = "terraform-user"
  }
}