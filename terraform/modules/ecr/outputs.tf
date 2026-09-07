output "repository_urls" {
  description = "Map of backend service keys to ECR repository URLs."
  value       = { for key, repo in aws_ecr_repository.service : key => repo.repository_url }
}

output "repository_arns" {
  description = "Map of backend service keys to ECR repository ARNs."
  value       = { for key, repo in aws_ecr_repository.service : key => repo.arn }
}
