variable "name_prefix" {
  description = "Name prefix applied to frontend hosting resources."
  type        = string
}

variable "frontend_bucket_name" {
  description = "Name of the S3 bucket that hosts the built frontend assets."
  type        = string
}

variable "api_gateway_domain_name" {
  description = "API Gateway domain name used as the CloudFront /api origin."
  type        = string
}

variable "custom_domain_name" {
  description = "Optional custom domain name to attach to the CloudFront distribution."
  type        = string
  default     = null
}

variable "acm_certificate_arn" {
  description = "Optional ACM certificate ARN for the CloudFront custom domain."
  type        = string
  default     = null
}

variable "tags" {
  description = "Tags applied to frontend hosting resources."
  type        = map(string)
}
