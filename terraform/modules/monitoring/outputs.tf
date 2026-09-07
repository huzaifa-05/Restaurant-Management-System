output "alb_health_alarm_names" {
  description = "CloudWatch alarm names used by ALB health monitoring."
  value = concat(
    [aws_cloudwatch_metric_alarm.alb_5xx.alarm_name],
    [for alarm in aws_cloudwatch_metric_alarm.unhealthy_targets : alarm.alarm_name]
  )
}
