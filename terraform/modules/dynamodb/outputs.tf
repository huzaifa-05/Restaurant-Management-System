output "users_table_name" {
  description = "Name of the DynamoDB users table."
  value       = aws_dynamodb_table.users.name
}

output "users_table_arn" {
  description = "ARN of the DynamoDB users table."
  value       = aws_dynamodb_table.users.arn
}

output "menu_table_name" {
  description = "Name of the DynamoDB menu table."
  value       = aws_dynamodb_table.menu.name
}

output "menu_table_arn" {
  description = "ARN of the DynamoDB menu table."
  value       = aws_dynamodb_table.menu.arn
}

output "orders_table_name" {
  description = "Name of the DynamoDB orders table."
  value       = aws_dynamodb_table.orders.name
}

output "orders_table_arn" {
  description = "ARN of the DynamoDB orders table."
  value       = aws_dynamodb_table.orders.arn
}

output "payments_table_name" {
  description = "Name of the DynamoDB payments table."
  value       = aws_dynamodb_table.payments.name
}

output "payments_table_arn" {
  description = "ARN of the DynamoDB payments table."
  value       = aws_dynamodb_table.payments.arn
}
