variable "name_prefix" {
  description = "Name prefix applied to ECR repositories."
  type        = string
}

variable "tags" {
  description = "Tags applied to ECR repositories."
  type        = map(string)
}

variable "retain_image_count" {
  description = "Number of recent images retained in each ECR repository."
  type        = number
  default     = 20
}
