variable "aws_region" {
  description = "AWS region where Terraform bootstrap resources are created."
  type        = string
  default     = "us-west-2"
}

variable "project_name" {
  description = "Project name used as the base prefix for bootstrap resources."
  type        = string
  default     = "foodie-we"
}

variable "owner" {
  description = "Owner tag applied to bootstrap resources."
  type        = string
  default     = "Huzaifa"
}

variable "state_bucket_name" {
  description = "Optional explicit S3 bucket name for Terraform remote state."
  type        = string
  default     = null
}

variable "noncurrent_version_retention_days" {
  description = "Number of days to retain older Terraform state object versions."
  type        = number
  default     = 90
}
