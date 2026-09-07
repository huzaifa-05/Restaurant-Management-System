variable "aws_region" {
  description = "AWS region where the Foodie WE dev environment is deployed."
  type        = string
  default     = "us-west-2"
}

variable "environment" {
  description = "Environment name used for naming and tagging resources."
  type        = string
  default     = "dev"
}

variable "project_name" {
  description = "Project name used as the base prefix for Foodie WE resources."
  type        = string
  default     = "foodie-we"
}

variable "vpc_cidr" {
  description = "CIDR block for the Foodie WE VPC."
  type        = string
  default     = "10.42.0.0/16"
}

variable "public_subnet_a_cidr" {
  description = "CIDR block for public subnet A."
  type        = string
  default     = "10.42.1.0/24"
}

variable "private_subnet_a_cidr" {
  description = "CIDR block for private subnet A."
  type        = string
  default     = "10.42.11.0/24"
}

variable "public_subnet_b_cidr" {
  description = "CIDR block for public subnet B."
  type        = string
  default     = "10.42.2.0/24"
}

variable "private_subnet_b_cidr" {
  description = "CIDR block for private subnet B."
  type        = string
  default     = "10.42.12.0/24"
}

variable "bootstrap_image_tag" {
  description = "Initial image tag used by ECS task definitions before CI/CD publishes service images."
  type        = string
  default     = "v1"
}

variable "desired_count" {
  description = "Desired number of ECS tasks for each backend service."
  type        = number
  default     = 1
}

variable "ecs_cpu" {
  description = "CPU units allocated to each ECS Fargate task."
  type        = number
  default     = 256
}

variable "ecs_memory" {
  description = "Memory in MiB allocated to each ECS Fargate task."
  type        = number
  default     = 512
}

variable "log_retention_days" {
  description = "CloudWatch Logs retention period in days for application log groups."
  type        = number
  default     = 14
}

variable "lambda_timeout_seconds" {
  description = "Timeout in seconds for the Payment Lambda."
  type        = number
  default     = 30
}

variable "payment_success_rate" {
  description = "Default simulated payment success rate passed to the Payment Lambda."
  type        = string
  default     = "0.9"
}

variable "github_connection_name" {
  description = "Name of the CodeConnections connection used by CI/CD."
  type        = string
  default     = "restaurant-connection"
}

variable "github_full_repository_id" {
  description = "GitHub repository identifier in owner/repository format for CI/CD source actions."
  type        = string
  default     = "huzaifa-05/Restaurant-Management-System"
}

variable "github_branch" {
  description = "Git branch watched by CI/CD pipelines."
  type        = string
  default     = "main"
}
