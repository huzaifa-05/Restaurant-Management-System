variable "name_prefix" {
  description = "Name prefix applied to ECS resources."
  type        = string
}

variable "aws_region" {
  description = "AWS region used by ECS task environment variables."
  type        = string
}

variable "private_subnet_a_id" {
  description = "Private subnet ID where ECS Fargate services run."
  type        = string
}

variable "ecs_security_group_id" {
  description = "Security group ID attached to ECS tasks."
  type        = string
}

variable "target_group_arns" {
  description = "Map of ECS service keys to ALB target group ARNs."
  type        = map(string)
}

variable "ecr_repository_urls" {
  description = "Map of ECS service keys to ECR repository URLs."
  type        = map(string)
}

variable "bootstrap_image_tag" {
  description = "Initial image tag used by ECS task definitions before CI/CD publishes service images."
  type        = string
}

variable "task_execution_role_arn" {
  description = "ARN of the ECS task execution role."
  type        = string
}

variable "user_task_role_arn" {
  description = "ARN of the IAM task role used by the User ECS service."
  type        = string
}

variable "menu_task_role_arn" {
  description = "ARN of the IAM task role used by the Menu ECS service."
  type        = string
}

variable "order_task_role_arn" {
  description = "ARN of the IAM task role used by the Order ECS service."
  type        = string
}

variable "users_table_name" {
  description = "Name of the DynamoDB users table."
  type        = string
}

variable "menu_table_name" {
  description = "Name of the DynamoDB menu table."
  type        = string
}

variable "orders_table_name" {
  description = "Name of the DynamoDB orders table."
  type        = string
}

variable "cognito_user_pool_id" {
  description = "Cognito user pool ID used by backend services."
  type        = string
}

variable "cognito_user_pool_client_id" {
  description = "Cognito user pool client ID used by backend services."
  type        = string
}

variable "desired_count" {
  description = "Desired number of tasks for each ECS service."
  type        = number
}

variable "cpu" {
  description = "CPU units allocated to each ECS task."
  type        = number
}

variable "memory" {
  description = "Memory in MiB allocated to each ECS task."
  type        = number
}

variable "log_retention_days" {
  description = "CloudWatch Logs retention period in days for ECS service log groups."
  type        = number
}

variable "tags" {
  description = "Tags applied to ECS resources."
  type        = map(string)
}
