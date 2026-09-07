variable "name_prefix" {
  description = "Name prefix applied to security groups."
  type        = string
}

variable "vpc_id" {
  description = "ID of the VPC where security groups are created."
  type        = string
}

variable "private_subnet_a_id" {
  description = "ID of private subnet A where interface endpoints are placed."
  type        = string
}

variable "private_subnet_b_id" {
  description = "ID of private subnet B where interface endpoints are placed."
  type        = string
}

variable "tags" {
  description = "Tags applied to security groups."
  type        = map(string)
}
