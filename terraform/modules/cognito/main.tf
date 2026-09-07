resource "aws_cognito_user_pool" "this" {
  name = "${var.name_prefix}-users"

  username_attributes      = ["email"]
  auto_verified_attributes = ["email"]

  schema {
    name                = "email"
    attribute_data_type = "String"
    required            = true
    mutable             = true
  }

  tags = var.tags
}

resource "aws_cognito_user_pool_client" "this" {
  name                                 = "${var.name_prefix}-web-client"
  user_pool_id                         = aws_cognito_user_pool.this.id
  generate_secret                      = false
  allowed_oauth_flows_user_pool_client = false
  prevent_user_existence_errors        = "ENABLED"
}

resource "aws_cognito_user_group" "admins" {
  name         = "Admins"
  user_pool_id = aws_cognito_user_pool.this.id
  description  = "Foodie WE administrators"
}
