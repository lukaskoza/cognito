variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "eu-central-1"
}

variable "aws_profile" {
  description = "AWS profile"
  type        = string
  default     = "terraform-user"
}

variable "state_table_name" {
  description = "Name of the DynamoDB table for Terraform locks"
  type        = string
  default     = "chesster-terraform-locks"
}