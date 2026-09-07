variable "name_prefix" {
  description = "Name prefix applied to DynamoDB tables."
  type        = string
}

variable "tags" {
  description = "Tags applied to DynamoDB tables."
  type        = map(string)
}
