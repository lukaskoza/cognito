provider "aws" {
  region = "eu-central-1"
  profile = "terraform-user"
}

terraform {
  required_version = ">= 1.0.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.94"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.1"
    }
  }
}
