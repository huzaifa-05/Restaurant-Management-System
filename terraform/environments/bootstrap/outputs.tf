output "state_bucket_name" {
  description = "S3 bucket name to use in environment backend configuration."
  value       = module.remote_state.bucket_name
}

output "state_bucket_arn" {
  description = "ARN of the S3 bucket used for Terraform remote state."
  value       = module.remote_state.bucket_arn
}

output "dev_backend_config" {
  description = "Backend settings for terraform/environments/dev."
  value = {
    bucket = module.remote_state.bucket_name
    key    = "foodie-we/dev/terraform.tfstate"
    region = var.aws_region
  }
}
