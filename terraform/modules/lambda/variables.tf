variable "name_prefix" {
  description = "Name prefix applied to Lambda resources."
  type        = string
}

variable "payment_source_dir" {
  description = "Local source directory packaged for the Payment Lambda."
  type        = string
}

variable "payment_lambda_role_arn" {
  description = "ARN of the IAM execution role used by the Payment Lambda."
  type        = string
}

variable "payments_table_name" {
  description = "Name of the DynamoDB payments table used by the Payment Lambda."
  type        = string
}

variable "payment_success_rate" {
  description = "Default simulated payment success rate passed to the Payment Lambda."
  type        = string
}

variable "log_retention_days" {
  description = "CloudWatch Logs retention period in days for the Payment Lambda log group."
  type        = number
}

variable "lambda_timeout_seconds" {
  description = "Timeout in seconds for the Payment Lambda."
  type        = number
}

variable "tags" {
  description = "Tags applied to Lambda resources."
  type        = map(string)
}
