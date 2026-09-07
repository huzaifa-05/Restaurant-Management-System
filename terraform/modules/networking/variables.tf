variable "name_prefix" {
  description = "Name prefix applied to networking resources."
  type        = string
}

variable "vpc_cidr" {
  description = "CIDR block for the Foodie WE VPC."
  type        = string
}

variable "public_subnet_a_cidr" {
  description = "CIDR block for public subnet A."
  type        = string
}

variable "private_subnet_a_cidr" {
  description = "CIDR block for private subnet A."
  type        = string
}

variable "public_subnet_b_cidr" {
  description = "CIDR block for public subnet B."
  type        = string
}

variable "private_subnet_b_cidr" {
  description = "CIDR block for private subnet B."
  type        = string
}

variable "tags" {
  description = "Tags applied to networking resources."
  type        = map(string)
}
