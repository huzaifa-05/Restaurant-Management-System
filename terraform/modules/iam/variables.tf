variable "name_prefix" {
  description = "Name prefix applied to IAM roles and policies."
  type        = string
}

variable "tags" {
  description = "Tags applied to IAM roles."
  type        = map(string)
}

variable "users_table_arn" {
  description = "ARN of the DynamoDB users table accessed by the User ECS task role."
  type        = string
}

variable "menu_table_arn" {
  description = "ARN of the DynamoDB menu table accessed by the Menu ECS task role."
  type        = string
}

variable "orders_table_arn" {
  description = "ARN of the DynamoDB orders table accessed by the Order ECS task role."
  type        = string
}

variable "payments_table_arn" {
  description = "ARN of the DynamoDB payments table accessed by the Payment Lambda role."
  type        = string
}

variable "frontend_bucket_arn" {
  description = "ARN of the S3 bucket used for frontend hosting."
  type        = string
}

variable "cloudfront_distribution_arn" {
  description = "ARN of the CloudFront distribution invalidated by the frontend CodeBuild project."
  type        = string
}

variable "payment_lambda_name" {
  description = "Name of the Payment Lambda updated by the payment CodeBuild project."
  type        = string
}

variable "ecr_repository_arns" {
  description = "ARNs of the ECR repositories used by backend ECS image builds."
  type        = list(string)
}

variable "artifact_bucket_arn" {
  description = "ARN of the CI/CD artifact S3 bucket."
  type        = string
}

variable "codeconnection_arn" {
  description = "ARN of the CodeStar Connections or CodeConnections connection used by CI/CD."
  type        = string
}

variable "codebuild_project_arns" {
  description = "ARNs of CodeBuild projects that CodePipeline can start."
  type        = list(string)
  default     = ["*"]
}
