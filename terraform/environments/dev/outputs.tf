output "vpc_id" {
  description = "ID of the Foodie WE VPC."
  value       = module.networking.vpc_id
}

output "availability_zone_a" {
  description = "Availability Zone used for public subnet A and private subnet A."
  value       = module.networking.availability_zone_a
}

output "availability_zone_b" {
  description = "Availability Zone used for public subnet B and private subnet B."
  value       = module.networking.availability_zone_b
}

output "public_subnet_a_id" {
  description = "ID of public subnet A."
  value       = module.networking.public_subnet_a_id
}

output "private_subnet_a_id" {
  description = "ID of private subnet A, where ECS workloads run."
  value       = module.networking.private_subnet_a_id
}

output "public_subnet_b_id" {
  description = "ID of public subnet B."
  value       = module.networking.public_subnet_b_id
}

output "private_subnet_b_id" {
  description = "ID of private subnet B, used by the internal ALB."
  value       = module.networking.private_subnet_b_id
}

output "dynamodb_vpc_endpoint_id" {
  description = "ID of the DynamoDB gateway VPC endpoint."
  value       = module.networking.dynamodb_endpoint_id
}

output "s3_vpc_endpoint_id" {
  description = "ID of the S3 gateway VPC endpoint."
  value       = module.networking.s3_endpoint_id
}

output "internal_alb_dns_name" {
  description = "DNS name of the internal ALB used by API Gateway VPC Link."
  value       = module.alb.alb_dns_name
}

output "cloudfront_distribution_id" {
  description = "ID of the CloudFront distribution serving the frontend and API path."
  value       = module.frontend.cloudfront_distribution_id
}

output "cloudfront_domain_name" {
  description = "Domain name of the CloudFront distribution."
  value       = module.frontend.cloudfront_domain_name
}

output "frontend_custom_domain_name" {
  description = "Custom Route 53 domain mapped to the CloudFront distribution."
  value       = local.frontend_custom_domain_name
}

output "frontend_bucket_name" {
  description = "Name of the private S3 bucket that stores the built frontend."
  value       = module.frontend.frontend_bucket_name
}

output "cognito_user_pool_id" {
  description = "ID of the Cognito User Pool used by the API Gateway JWT authorizer."
  value       = module.cognito.user_pool_id
}

output "cognito_user_pool_client_id" {
  description = "ID of the Cognito User Pool client used as the JWT audience."
  value       = module.cognito.user_pool_client_id
}

output "cognito_issuer_url" {
  description = "Issuer URL used by the API Gateway JWT authorizer."
  value       = module.cognito.issuer_url
}

output "api_gateway_endpoint" {
  description = "Public endpoint of the HTTP API behind CloudFront /api/*."
  value       = module.api_gateway.api_gateway_endpoint
}

output "api_gateway_id" {
  description = "ID of the API Gateway HTTP API."
  value       = module.api_gateway.api_gateway_id
}

output "ecs_cluster_name" {
  description = "Name of the ECS cluster running User, Menu, and Order services."
  value       = module.ecs.ecs_cluster_name
}

output "user_service_name" {
  description = "Name of the User ECS service."
  value       = module.ecs.user_ecs_service_name
}

output "menu_service_name" {
  description = "Name of the Menu ECS service."
  value       = module.ecs.menu_ecs_service_name
}

output "order_service_name" {
  description = "Name of the Order ECS service."
  value       = module.ecs.order_ecs_service_name
}

output "ecr_repository_urls" {
  description = "ECR repository URLs for ECS services."
  value       = module.ecr.repository_urls
}

output "dynamodb_table_names" {
  description = "DynamoDB table names used by the application services."
  value = {
    users    = module.dynamodb.users_table_name
    menu     = module.dynamodb.menu_table_name
    orders   = module.dynamodb.orders_table_name
    payments = module.dynamodb.payments_table_name
  }
}

output "payment_lambda_name" {
  description = "Name of the Payment Lambda function."
  value       = module.lambda.payment_lambda_name
}
