variable "name_prefix" {
  description = "Name prefix applied to Cognito resources."
  type        = string
}

variable "tags" {
  description = "Tags applied to Cognito resources."
  type        = map(string)
}
