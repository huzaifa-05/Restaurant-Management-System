output "alb_security_group_id" {
  description = "ID of the security group attached to the internal ALB."
  value       = aws_security_group.alb.id
}

output "api_gateway_vpc_link_security_group_id" {
  description = "ID of the security group attached to the API Gateway VPC Link."
  value       = aws_security_group.api_gateway_vpc_link.id
}

output "ecs_security_group_id" {
  description = "ID of the security group attached to ECS tasks."
  value       = aws_security_group.ecs.id
}

output "vpc_endpoint_security_group_id" {
  description = "ID of the security group attached to interface VPC endpoints."
  value       = aws_security_group.vpc_endpoints.id
}
