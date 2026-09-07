output "vpc_id" {
  description = "ID of the Foodie WE VPC."
  value       = aws_vpc.this.id
}

output "availability_zone_a" {
  description = "First Availability Zone used for public subnet A and private subnet A."
  value       = local.availability_zone_a
}

output "availability_zone_b" {
  description = "Second Availability Zone used for public subnet B and private subnet B."
  value       = local.availability_zone_b
}

output "public_subnet_a_id" {
  description = "ID of public subnet A."
  value       = aws_subnet.public_a.id
}

output "private_subnet_a_id" {
  description = "ID of private subnet A, where ECS workloads and one internal ALB node run."
  value       = aws_subnet.private_a.id
}

output "public_subnet_b_id" {
  description = "ID of public subnet B."
  value       = aws_subnet.public_b.id
}

output "private_subnet_b_id" {
  description = "ID of private subnet B, used for the second internal ALB node."
  value       = aws_subnet.private_b.id
}

output "public_route_table_id" {
  description = "ID of the route table shared by both public subnets."
  value       = aws_route_table.public.id
}

output "private_route_table_a_id" {
  description = "ID of the private route table for private subnet A."
  value       = aws_route_table.private_a.id
}

output "private_route_table_b_id" {
  description = "ID of the private route table for private subnet B."
  value       = aws_route_table.private_b.id
}

output "dynamodb_endpoint_id" {
  description = "ID of the DynamoDB gateway VPC endpoint."
  value       = aws_vpc_endpoint.dynamodb.id
}

output "s3_endpoint_id" {
  description = "ID of the S3 gateway VPC endpoint."
  value       = aws_vpc_endpoint.s3.id
}
