# First time initialization
1. Comment out backend.tf
2. Run `terraform init`
3. Run `terraform plan`
4. Run `terraform apply`
5. Uncomment backend.tf
6. Run `terraform init -migrate-state`
7. Run `terraform plan`
8. Run `terraform apply`


# Cognito

### Show variables for backend
```
terraform output backend_env_vars
```