variable "bucket_name" {
  description = "Globally unique S3 bucket name used for Terraform remote state."
  type        = string
}

variable "noncurrent_version_retention_days" {
  description = "Number of days to retain older Terraform state object versions."
  type        = number
  default     = 90
}

variable "tags" {
  description = "Tags applied to remote-state resources."
  type        = map(string)
}
