data "aws_region" "current" {}

resource "aws_security_group" "alb" {
  name        = "${var.name_prefix}-alb-sg"
  description = "Private ALB access from API Gateway VPC Link"
  vpc_id      = var.vpc_id
  tags        = merge(var.tags, { Name = "${var.name_prefix}-alb-sg" })
}

resource "aws_security_group" "api_gateway_vpc_link" {
  name        = "${var.name_prefix}-api-gateway-vpc-link-sg"
  description = "API Gateway VPC Link access to private ALB"
  vpc_id      = var.vpc_id
  tags        = merge(var.tags, { Name = "${var.name_prefix}-api-gateway-vpc-link-sg" })
}

resource "aws_vpc_security_group_ingress_rule" "alb_http_from_api_gateway" {
  security_group_id            = aws_security_group.alb.id
  referenced_security_group_id = aws_security_group.api_gateway_vpc_link.id
  from_port                    = 80
  to_port                      = 80
  ip_protocol                  = "tcp"
  description                  = "Allow API Gateway VPC Link to private ALB"
}

resource "aws_vpc_security_group_egress_rule" "alb_to_ecs" {
  security_group_id            = aws_security_group.alb.id
  referenced_security_group_id = aws_security_group.ecs.id
  ip_protocol                  = "tcp"
  from_port                    = 5001
  to_port                      = 5003
  description                  = "Forward API traffic to ECS tasks"
}

resource "aws_vpc_security_group_egress_rule" "api_gateway_vpc_link_to_alb" {
  security_group_id            = aws_security_group.api_gateway_vpc_link.id
  referenced_security_group_id = aws_security_group.alb.id
  from_port                    = 80
  to_port                      = 80
  ip_protocol                  = "tcp"
  description                  = "Allow VPC Link traffic to private ALB"
}

resource "aws_security_group" "ecs" {
  name        = "${var.name_prefix}-ecs-sg"
  description = "Private ECS task access"
  vpc_id      = var.vpc_id
  tags        = merge(var.tags, { Name = "${var.name_prefix}-ecs-sg" })
}

resource "aws_security_group" "vpc_endpoints" {
  name        = "${var.name_prefix}-vpc-endpoints-sg"
  description = "Interface endpoint access for private ECS tasks"
  vpc_id      = var.vpc_id
  tags        = merge(var.tags, { Name = "${var.name_prefix}-vpc-endpoints-sg" })
}

resource "aws_vpc_security_group_ingress_rule" "vpc_endpoints_from_ecs" {
  security_group_id            = aws_security_group.vpc_endpoints.id
  referenced_security_group_id = aws_security_group.ecs.id
  from_port                    = 443
  to_port                      = 443
  ip_protocol                  = "tcp"
  description                  = "Allow ECS tasks to use VPC interface endpoints"
}

resource "aws_vpc_security_group_egress_rule" "vpc_endpoints_all" {
  security_group_id = aws_security_group.vpc_endpoints.id
  cidr_ipv4         = "0.0.0.0/0"
  ip_protocol       = "-1"
  description       = "Allow interface endpoints to return traffic"
}

resource "aws_vpc_security_group_ingress_rule" "ecs_from_alb" {
  for_each                     = toset(["5001", "5002", "5003"])
  security_group_id            = aws_security_group.ecs.id
  referenced_security_group_id = aws_security_group.alb.id
  from_port                    = tonumber(each.value)
  to_port                      = tonumber(each.value)
  ip_protocol                  = "tcp"
  description                  = "Allow ALB to service port ${each.value}"
}

resource "aws_vpc_security_group_ingress_rule" "ecs_service_connect_menu" {
  security_group_id            = aws_security_group.ecs.id
  referenced_security_group_id = aws_security_group.ecs.id
  from_port                    = 5002
  to_port                      = 5002
  ip_protocol                  = "tcp"
  description                  = "Allow Order to Menu through Service Connect"
}

resource "aws_vpc_security_group_egress_rule" "ecs_all" {
  security_group_id = aws_security_group.ecs.id
  cidr_ipv4         = "0.0.0.0/0"
  ip_protocol       = "-1"
  description       = "Allow private tasks to reach AWS services through endpoints"
}

resource "aws_vpc_endpoint" "ecr_api" {
  vpc_id              = var.vpc_id
  service_name        = "com.amazonaws.${data.aws_region.current.region}.ecr.api"
  vpc_endpoint_type   = "Interface"
  subnet_ids          = [var.private_subnet_a_id, var.private_subnet_b_id]
  security_group_ids  = [aws_security_group.vpc_endpoints.id]
  private_dns_enabled = true
  tags                = merge(var.tags, { Name = "${var.name_prefix}-ecr-api-endpoint" })
}

resource "aws_vpc_endpoint" "ecr_dkr" {
  vpc_id              = var.vpc_id
  service_name        = "com.amazonaws.${data.aws_region.current.region}.ecr.dkr"
  vpc_endpoint_type   = "Interface"
  subnet_ids          = [var.private_subnet_a_id, var.private_subnet_b_id]
  security_group_ids  = [aws_security_group.vpc_endpoints.id]
  private_dns_enabled = true
  tags                = merge(var.tags, { Name = "${var.name_prefix}-ecr-dkr-endpoint" })
}

resource "aws_vpc_endpoint" "logs" {
  vpc_id              = var.vpc_id
  service_name        = "com.amazonaws.${data.aws_region.current.region}.logs"
  vpc_endpoint_type   = "Interface"
  subnet_ids          = [var.private_subnet_a_id, var.private_subnet_b_id]
  security_group_ids  = [aws_security_group.vpc_endpoints.id]
  private_dns_enabled = true
  tags                = merge(var.tags, { Name = "${var.name_prefix}-logs-endpoint" })
}
