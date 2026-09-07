variable "name_prefix" {
  description = "Name prefix applied to API Gateway resources."
  type        = string
}

variable "private_subnet_ids" {
  description = "Private subnet IDs used by the API Gateway VPC Link."
  type        = list(string)
}

variable "vpc_link_security_group_id" {
  description = "Security group ID attached to the API Gateway VPC Link."
  type        = string
}

variable "alb_listener_arn" {
  description = "ARN of the internal ALB listener used by ECS API integrations."
  type        = string
}

variable "payment_lambda_invoke_arn" {
  description = "Invoke ARN of the Payment Lambda integration."
  type        = string
}

variable "payment_lambda_name" {
  description = "Name of the Payment Lambda allowed to be invoked by API Gateway."
  type        = string
}

variable "cognito_issuer_url" {
  description = "Issuer URL for the Cognito JWT authorizer."
  type        = string
}

variable "cognito_user_pool_client_id" {
  description = "Cognito user pool client ID used as the JWT audience."
  type        = string
}

variable "tags" {
  description = "Tags applied to API Gateway resources."
  type        = map(string)
}
