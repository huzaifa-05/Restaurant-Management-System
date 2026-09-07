resource "aws_apigatewayv2_api" "this" {
  name          = "${var.name_prefix}-api"
  protocol_type = "HTTP"
  tags          = var.tags
}

resource "aws_apigatewayv2_authorizer" "cognito" {
  name             = "${var.name_prefix}-cognito-jwt"
  api_id           = aws_apigatewayv2_api.this.id
  authorizer_type  = "JWT"
  identity_sources = ["$request.header.Authorization"]

  jwt_configuration {
    audience = [var.cognito_user_pool_client_id]
    issuer   = var.cognito_issuer_url
  }
}

resource "aws_apigatewayv2_vpc_link" "private_alb" {
  name               = "${var.name_prefix}-private-alb-link"
  security_group_ids = [var.vpc_link_security_group_id]
  subnet_ids         = var.private_subnet_ids
  tags               = var.tags
}

resource "aws_apigatewayv2_integration" "ecs" {
  api_id             = aws_apigatewayv2_api.this.id
  integration_type   = "HTTP_PROXY"
  integration_method = "ANY"
  integration_uri    = var.alb_listener_arn
  connection_type    = "VPC_LINK"
  connection_id      = aws_apigatewayv2_vpc_link.private_alb.id

  request_parameters = {
    "overwrite:header.x-user-id"    = "$context.authorizer.jwt.claims.sub"
    "overwrite:header.x-user-email" = "$context.authorizer.jwt.claims.email"
  }
}

resource "aws_apigatewayv2_integration" "payment" {
  api_id                 = aws_apigatewayv2_api.this.id
  integration_type       = "AWS_PROXY"
  integration_uri        = var.payment_lambda_invoke_arn
  payload_format_version = "2.0"
}

locals {
  ecs_routes = {
    "ANY /api/users"                    = true
    "ANY /api/users/{proxy+}"           = true
    "ANY /api/menu"                     = false
    "GET /api/menu/{proxy+}"            = false
    "GET /api/menu/items"               = false
    "GET /api/menu/items/{proxy+}"      = false
    "GET /api/menu/category/{proxy+}"   = false
    "ANY /api/orders"                   = true
    "ANY /api/orders/{proxy+}"          = true
    "ANY /api/orders/internal/{proxy+}" = false
    "POST /api/menu/items"              = true
    "PUT /api/menu/items/{proxy+}"      = true
    "DELETE /api/menu/items/{proxy+}"   = true
    "PATCH /api/menu/items/{proxy+}"    = true
  }

  protected_payment_routes = [
    "POST /api/payments",
    "GET /api/payments/{paymentId}",
    "GET /api/payments/order/{orderId}",
    "POST /api/payments/{paymentId}/refund"
  ]

  public_payment_routes = [
    "POST /api/payments/webhook"
  ]
}

resource "aws_apigatewayv2_route" "ecs" {
  for_each           = local.ecs_routes
  api_id             = aws_apigatewayv2_api.this.id
  route_key          = each.key
  target             = "integrations/${aws_apigatewayv2_integration.ecs.id}"
  authorization_type = each.value ? "JWT" : "NONE"
  authorizer_id      = each.value ? aws_apigatewayv2_authorizer.cognito.id : null
}

resource "aws_apigatewayv2_route" "payment_protected" {
  for_each           = toset(local.protected_payment_routes)
  api_id             = aws_apigatewayv2_api.this.id
  route_key          = each.value
  target             = "integrations/${aws_apigatewayv2_integration.payment.id}"
  authorization_type = "JWT"
  authorizer_id      = aws_apigatewayv2_authorizer.cognito.id
}

resource "aws_apigatewayv2_route" "payment_public" {
  for_each  = toset(local.public_payment_routes)
  api_id    = aws_apigatewayv2_api.this.id
  route_key = each.value
  target    = "integrations/${aws_apigatewayv2_integration.payment.id}"
}

resource "aws_apigatewayv2_stage" "default" {
  api_id      = aws_apigatewayv2_api.this.id
  name        = "$default"
  auto_deploy = true
  tags        = var.tags
}

resource "aws_lambda_permission" "api_gateway" {
  statement_id  = "AllowPaymentHttpApiInvoke"
  action        = "lambda:InvokeFunction"
  function_name = var.payment_lambda_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.this.execution_arn}/*/*"
}
