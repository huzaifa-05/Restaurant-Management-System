variable "name_prefix" {
  description = "Name prefix applied to ALB resources."
  type        = string
}

variable "vpc_id" {
  description = "ID of the VPC where the internal ALB is created."
  type        = string
}

variable "private_subnet_a_id" {
  description = "ID of private subnet A for the internal ALB."
  type        = string
}

variable "private_subnet_b_id" {
  description = "ID of private subnet B for the internal ALB."
  type        = string
}

variable "alb_security_group_id" {
  description = "ID of the security group attached to the internal ALB."
  type        = string
}

variable "tags" {
  description = "Tags applied to ALB resources."
  type        = map(string)
}
