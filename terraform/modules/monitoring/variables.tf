variable "name_prefix" {
  description = "Name prefix applied to monitoring resources."
  type        = string
}

variable "alb_arn_suffix" {
  description = "ARN suffix of the ALB used in CloudWatch metrics."
  type        = string
}

variable "target_group_arn_suffixes" {
  description = "Map of service keys to target group ARN suffixes used in CloudWatch metrics."
  type        = map(string)
}

variable "alarm_evaluation_periods" {
  description = "Number of CloudWatch evaluation periods used by ECS monitoring alarms."
  type        = number
}

variable "alb_5xx_threshold" {
  description = "Threshold for the ALB 5xx CloudWatch alarm."
  type        = number
}

variable "tags" {
  description = "Tags applied to monitoring resources."
  type        = map(string)
}
