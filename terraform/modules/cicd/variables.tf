variable "name_prefix" {
  description = "Name prefix applied to CI/CD resources."
  type        = string
}

variable "github_connection_arn" {
  description = "ARN of the CodeStar Connections or CodeConnections connection used by pipeline source actions."
  type        = string
}

variable "github_full_repository_id" {
  description = "GitHub repository identifier in owner/repository format."
  type        = string
}

variable "github_branch" {
  description = "Git branch watched by the CI/CD pipelines."
  type        = string
}

variable "codepipeline_role_arn" {
  description = "ARN of the IAM role used by CodePipeline."
  type        = string
}

variable "terraform_codebuild_role_arn" {
  description = "ARN of the IAM role used by Terraform CodeBuild projects."
  type        = string
}

variable "frontend_codebuild_role_arn" {
  description = "ARN of the IAM role used by the frontend CodeBuild project."
  type        = string
}

variable "backend_codebuild_role_arn" {
  description = "ARN of the IAM role used by the backend ECS CodeBuild project."
  type        = string
}

variable "payment_codebuild_role_arn" {
  description = "ARN of the IAM role used by the Payment Lambda CodeBuild project."
  type        = string
}

variable "artifact_bucket_name" {
  description = "Name of the S3 bucket used for CI/CD artifacts."
  type        = string
}

variable "frontend_bucket_name" {
  description = "Name of the S3 bucket that hosts frontend build artifacts."
  type        = string
}

variable "cloudfront_distribution_id" {
  description = "ID of the CloudFront distribution invalidated after frontend deployments."
  type        = string
}

variable "cloudfront_domain_name" {
  description = "CloudFront domain name used as the frontend API base URL."
  type        = string
}

variable "ecs_cluster_name" {
  description = "Name of the ECS cluster updated by the backend pipeline."
  type        = string
}

variable "user_ecs_service_name" {
  description = "Name of the User ECS service updated by the backend pipeline."
  type        = string
}

variable "menu_ecs_service_name" {
  description = "Name of the Menu ECS service updated by the backend pipeline."
  type        = string
}

variable "order_ecs_service_name" {
  description = "Name of the Order ECS service updated by the backend pipeline."
  type        = string
}

variable "ecr_repository_urls" {
  description = "Map of backend service keys to ECR repository URLs."
  type        = map(string)
}

variable "payment_lambda_name" {
  description = "Name of the Payment Lambda updated by the payment pipeline."
  type        = string
}

variable "log_retention_days" {
  description = "CloudWatch Logs retention period for CodeBuild log groups."
  type        = number
}

variable "terraform_working_directory" {
  description = "Repository-relative Terraform working directory used by Terraform CodeBuild projects."
  type        = string
}

variable "tags" {
  description = "Tags applied to CI/CD resources."
  type        = map(string)
}
