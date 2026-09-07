output "log_group_names" {
  description = "Map of CodeBuild project keys to CloudWatch log group names."
  value       = { for key, group in aws_cloudwatch_log_group.this : key => group.name }
}

