output "user_pool_id" {
  description = "ID of the Cognito user pool."
  value       = aws_cognito_user_pool.this.id
}

output "user_pool_client_id" {
  description = "ID of the Cognito user pool app client."
  value       = aws_cognito_user_pool_client.this.id
}

output "issuer_url" {
  description = "Issuer URL used by API Gateway JWT authorization."
  value       = "https://cognito-idp.${data.aws_region.current.region}.amazonaws.com/${aws_cognito_user_pool.this.id}"
}

output "admins_group_name" {
  description = "Name of the Cognito administrators group."
  value       = aws_cognito_user_group.admins.name
}
