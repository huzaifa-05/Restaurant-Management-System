output "payment_lambda_name" {
  description = "Name of the Payment Lambda function."
  value       = aws_lambda_function.payment.function_name
}

output "payment_lambda_arn" {
  description = "ARN of the Payment Lambda function."
  value       = aws_lambda_function.payment.arn
}

output "payment_lambda_invoke_arn" {
  description = "Invoke ARN of the Payment Lambda function."
  value       = aws_lambda_function.payment.invoke_arn
}
