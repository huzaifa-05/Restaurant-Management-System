output "ecs_task_execution_role_arn" {
  description = "ARN of the IAM role used by ECS to pull images and write logs."
  value       = aws_iam_role.ecs_task_execution.arn
}

output "ecs_task_execution_role_name" {
  description = "Name of the IAM role used by ECS to pull images and write logs."
  value       = aws_iam_role.ecs_task_execution.name
}

output "user_task_role_arn" {
  description = "ARN of the IAM task role used by the User ECS service."
  value       = aws_iam_role.user_task.arn
}

output "user_task_role_name" {
  description = "Name of the IAM task role used by the User ECS service."
  value       = aws_iam_role.user_task.name
}

output "menu_task_role_arn" {
  description = "ARN of the IAM task role used by the Menu ECS service."
  value       = aws_iam_role.menu_task.arn
}

output "menu_task_role_name" {
  description = "Name of the IAM task role used by the Menu ECS service."
  value       = aws_iam_role.menu_task.name
}

output "order_task_role_arn" {
  description = "ARN of the IAM task role used by the Order ECS service."
  value       = aws_iam_role.order_task.arn
}

output "order_task_role_name" {
  description = "Name of the IAM task role used by the Order ECS service."
  value       = aws_iam_role.order_task.name
}

output "payment_lambda_role_arn" {
  description = "ARN of the IAM execution role used by the Payment Lambda."
  value       = aws_iam_role.payment_lambda.arn
}

output "payment_lambda_role_name" {
  description = "Name of the IAM execution role used by the Payment Lambda."
  value       = aws_iam_role.payment_lambda.name
}

output "codepipeline_role_arn" {
  description = "ARN of the IAM role used by CodePipeline."
  value       = aws_iam_role.codepipeline.arn
}

output "codepipeline_role_name" {
  description = "Name of the IAM role used by CodePipeline."
  value       = aws_iam_role.codepipeline.name
}

output "terraform_codebuild_role_arn" {
  description = "ARN of the IAM role used by Terraform CodeBuild projects."
  value       = aws_iam_role.terraform_codebuild.arn
}

output "terraform_codebuild_role_name" {
  description = "Name of the IAM role used by Terraform CodeBuild projects."
  value       = aws_iam_role.terraform_codebuild.name
}

output "frontend_codebuild_role_arn" {
  description = "ARN of the IAM role used by the frontend CodeBuild project."
  value       = aws_iam_role.frontend_codebuild.arn
}

output "frontend_codebuild_role_name" {
  description = "Name of the IAM role used by the frontend CodeBuild project."
  value       = aws_iam_role.frontend_codebuild.name
}

output "backend_codebuild_role_arn" {
  description = "ARN of the IAM role used by the backend ECS CodeBuild project."
  value       = aws_iam_role.backend_codebuild.arn
}

output "backend_codebuild_role_name" {
  description = "Name of the IAM role used by the backend ECS CodeBuild project."
  value       = aws_iam_role.backend_codebuild.name
}

output "payment_codebuild_role_arn" {
  description = "ARN of the IAM role used by the Payment Lambda CodeBuild project."
  value       = aws_iam_role.payment_codebuild.arn
}

output "payment_codebuild_role_name" {
  description = "Name of the IAM role used by the Payment Lambda CodeBuild project."
  value       = aws_iam_role.payment_codebuild.name
}
