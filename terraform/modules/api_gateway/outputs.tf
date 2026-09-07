output "api_gateway_endpoint" {
  description = "HTTPS endpoint of the API Gateway HTTP API."
  value       = aws_apigatewayv2_api.this.api_endpoint
}

output "api_gateway_domain_name" {
  description = "Domain name of the API Gateway HTTP API without the https:// prefix."
  value       = replace(aws_apigatewayv2_api.this.api_endpoint, "https://", "")
}

output "api_gateway_id" {
  description = "ID of the API Gateway HTTP API."
  value       = aws_apigatewayv2_api.this.id
}

output "api_gateway_vpc_link_id" {
  description = "ID of the API Gateway VPC Link used to reach the internal ALB."
  value       = aws_apigatewayv2_vpc_link.private_alb.id
}

output "jwt_authorizer_id" {
  description = "ID of the Cognito JWT authorizer."
  value       = aws_apigatewayv2_authorizer.cognito.id
}
