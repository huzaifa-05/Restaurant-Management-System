variable "project_names" {
  description = "Map of CodeBuild project keys to their project names."
  type        = map(string)
}

variable "retention_in_days" {
  description = "CloudWatch Logs retention period for CodeBuild log groups."
  type        = number
}

variable "tags" {
  description = "Tags applied to CodeBuild log groups."
  type        = map(string)
}
