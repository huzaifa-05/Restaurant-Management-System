output "alb_arn" {
  description = "ARN of the internal Application Load Balancer."
  value       = aws_lb.this.arn
}

output "alb_arn_suffix" {
  description = "ARN suffix of the internal ALB used by CloudWatch metrics."
  value       = aws_lb.this.arn_suffix
}

output "alb_dns_name" {
  description = "DNS name of the internal Application Load Balancer."
  value       = aws_lb.this.dns_name
}

output "alb_zone_id" {
  description = "Route 53 hosted zone ID of the internal Application Load Balancer."
  value       = aws_lb.this.zone_id
}

output "alb_listener_arn" {
  description = "ARN of the HTTP listener on the internal ALB."
  value       = aws_lb_listener.http.arn
}

output "target_group_arns" {
  description = "Map of service keys to ALB target group ARNs."
  value       = { for key, tg in aws_lb_target_group.service : key => tg.arn }
}

output "target_group_arn_suffixes" {
  description = "Map of service keys to ALB target group ARN suffixes."
  value       = { for key, tg in aws_lb_target_group.service : key => tg.arn_suffix }
}
