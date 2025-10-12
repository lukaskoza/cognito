# Root main.tf
terraform {
  required_version = ">= 1.0.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.94"
    }
  }
}

provider "aws" {
  region  = var.aws_region
  profile = var.aws_profile
}

module "initialization" {
  source = "./modules/initialization"
  
  bucket_name = "chesster-terraform-state-bucket"
  table_name  = var.state_table_name
}

module "auth_backend" {
  source = "./modules/auth-backend"
  
  depends_on = [module.initialization]
}