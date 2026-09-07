output "ecs_cluster_name" {
  description = "Name of the ECS cluster."
  value       = aws_ecs_cluster.this.name
}

output "ecs_cluster_arn" {
  description = "ARN of the ECS cluster."
  value       = aws_ecs_cluster.this.arn
}

output "user_ecs_service_name" {
  description = "Name of the User ECS service."
  value       = aws_ecs_service.service["user"].name
}

output "menu_ecs_service_name" {
  description = "Name of the Menu ECS service."
  value       = aws_ecs_service.service["menu"].name
}

output "order_ecs_service_name" {
  description = "Name of the Order ECS service."
  value       = aws_ecs_service.service["order"].name
}

output "service_connect_namespace_arn" {
  description = "ARN of the ECS Service Connect namespace."
  value       = aws_service_discovery_http_namespace.service_connect.arn
}
