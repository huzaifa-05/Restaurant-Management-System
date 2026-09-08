data "aws_caller_identity" "current" {}

locals {
  name_prefix                 = "${var.project_name}-${var.environment}"
  frontend_bucket_name        = "${local.name_prefix}-frontend-${data.aws_caller_identity.current.account_id}"
  artifact_bucket_name        = "${local.name_prefix}-pipeline-artifacts-${data.aws_caller_identity.current.account_id}"
  payment_lambda_name         = "${local.name_prefix}-payment"
  frontend_custom_domain_name = "${var.frontend_subdomain}.${var.route53_zone_name}"
  frontend_origins = [
    "http://localhost:5173",
    "https://${local.frontend_custom_domain_name}",
    "https://${module.frontend.cloudfront_domain_name}"
  ]

  common_tags = {
    Project     = "Foodie-WE"
    Environment = "Restaurant Management system"
    ManagedBy   = "Terraform"
    Owner       = "Huzaifa"
  }

  computed_frontend_bucket_arn = "arn:aws:s3:::${local.frontend_bucket_name}"
  computed_artifact_bucket_arn = "arn:aws:s3:::${local.artifact_bucket_name}"
}

data "aws_route53_zone" "public" {
  name         = "${var.route53_zone_name}."
  private_zone = false
}

resource "aws_acm_certificate" "frontend" {
  provider          = aws.us_east_1
  domain_name       = local.frontend_custom_domain_name
  validation_method = "DNS"

  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-frontend-cert"
  })
}

resource "aws_route53_record" "frontend_certificate_validation" {
  for_each = {
    for dvo in aws_acm_certificate.frontend.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }

  zone_id = data.aws_route53_zone.public.zone_id
  name    = each.value.name
  type    = each.value.type
  ttl     = 60
  records = [each.value.record]
}

resource "aws_acm_certificate_validation" "frontend" {
  provider                = aws.us_east_1
  certificate_arn         = aws_acm_certificate.frontend.arn
  validation_record_fqdns = [for record in aws_route53_record.frontend_certificate_validation : record.fqdn]
}

resource "aws_codestarconnections_connection" "restaurant" {
  name          = var.github_connection_name
  provider_type = "GitHub"
  tags          = local.common_tags
}

module "networking" {
  source                = "../../modules/networking"
  name_prefix           = local.name_prefix
  vpc_cidr              = var.vpc_cidr
  public_subnet_a_cidr  = var.public_subnet_a_cidr
  private_subnet_a_cidr = var.private_subnet_a_cidr
  public_subnet_b_cidr  = var.public_subnet_b_cidr
  private_subnet_b_cidr = var.private_subnet_b_cidr
  tags                  = local.common_tags
}

module "security" {
  source              = "../../modules/security"
  name_prefix         = local.name_prefix
  vpc_id              = module.networking.vpc_id
  private_subnet_a_id = module.networking.private_subnet_a_id
  private_subnet_b_id = module.networking.private_subnet_b_id
  tags                = local.common_tags
}

module "dynamodb" {
  source      = "../../modules/dynamodb"
  name_prefix = local.name_prefix
  tags        = local.common_tags
}

module "ecr" {
  source      = "../../modules/ecr"
  name_prefix = local.name_prefix
  tags        = local.common_tags
}

module "cognito" {
  source      = "../../modules/cognito"
  name_prefix = local.name_prefix
  tags        = local.common_tags
}

module "alb" {
  source                = "../../modules/alb"
  name_prefix           = local.name_prefix
  vpc_id                = module.networking.vpc_id
  private_subnet_a_id   = module.networking.private_subnet_a_id
  private_subnet_b_id   = module.networking.private_subnet_b_id
  alb_security_group_id = module.security.alb_security_group_id
  tags                  = local.common_tags
}

module "iam" {
  source = "../../modules/iam"

  name_prefix                 = local.name_prefix
  tags                        = local.common_tags
  users_table_arn             = module.dynamodb.users_table_arn
  menu_table_arn              = module.dynamodb.menu_table_arn
  orders_table_arn            = module.dynamodb.orders_table_arn
  payments_table_arn          = module.dynamodb.payments_table_arn
  frontend_bucket_arn         = local.computed_frontend_bucket_arn
  cloudfront_distribution_arn = "arn:aws:cloudfront::${data.aws_caller_identity.current.account_id}:distribution/*"
  payment_lambda_name         = local.payment_lambda_name
  ecr_repository_arns         = values(module.ecr.repository_arns)
  artifact_bucket_arn         = local.computed_artifact_bucket_arn
  codeconnection_arn          = aws_codestarconnections_connection.restaurant.arn
}

module "lambda" {
  source = "../../modules/lambda"

  name_prefix             = local.name_prefix
  payment_source_dir      = abspath("${path.root}/../../../services/payment-service")
  payment_lambda_role_arn = module.iam.payment_lambda_role_arn
  payments_table_name     = module.dynamodb.payments_table_name
  order_service_url       = "http://${module.alb.alb_dns_name}"
  internal_service_token  = var.service_internal_token
  private_subnet_ids      = [module.networking.private_subnet_a_id, module.networking.private_subnet_b_id]
  security_group_id       = module.security.payment_lambda_security_group_id
  payment_success_rate    = var.payment_success_rate
  log_retention_days      = var.log_retention_days
  lambda_timeout_seconds  = var.lambda_timeout_seconds
  tags                    = local.common_tags
}

module "api_gateway" {
  source = "../../modules/api_gateway"

  name_prefix                 = local.name_prefix
  private_subnet_ids          = [module.networking.private_subnet_a_id, module.networking.private_subnet_b_id]
  vpc_link_security_group_id  = module.security.api_gateway_vpc_link_security_group_id
  alb_listener_arn            = module.alb.alb_listener_arn
  payment_lambda_invoke_arn   = module.lambda.payment_lambda_invoke_arn
  payment_lambda_name         = module.lambda.payment_lambda_name
  cognito_issuer_url          = module.cognito.issuer_url
  cognito_user_pool_client_id = module.cognito.user_pool_client_id
  tags                        = local.common_tags
}

module "frontend" {
  source = "../../modules/frontend"

  name_prefix             = local.name_prefix
  frontend_bucket_name    = local.frontend_bucket_name
  api_gateway_domain_name = module.api_gateway.api_gateway_domain_name
  custom_domain_name      = local.frontend_custom_domain_name
  acm_certificate_arn     = aws_acm_certificate_validation.frontend.certificate_arn
  tags                    = local.common_tags
}

resource "aws_route53_record" "frontend_alias" {
  zone_id = data.aws_route53_zone.public.zone_id
  name    = local.frontend_custom_domain_name
  type    = "A"

  alias {
    name                   = module.frontend.cloudfront_domain_name
    zone_id                = module.frontend.cloudfront_hosted_zone_id
    evaluate_target_health = false
  }
}

module "monitoring" {
  source = "../../modules/monitoring"

  name_prefix               = local.name_prefix
  alb_arn_suffix            = module.alb.alb_arn_suffix
  target_group_arn_suffixes = module.alb.target_group_arn_suffixes
  alarm_evaluation_periods  = 2
  alb_5xx_threshold         = 5
  tags                      = local.common_tags
}

module "ecs" {
  source = "../../modules/ecs"

  name_prefix                 = local.name_prefix
  aws_region                  = var.aws_region
  private_subnet_a_id         = module.networking.private_subnet_a_id
  ecs_security_group_id       = module.security.ecs_security_group_id
  target_group_arns           = module.alb.target_group_arns
  ecr_repository_urls         = module.ecr.repository_urls
  bootstrap_image_tag         = var.bootstrap_image_tag
  task_execution_role_arn     = module.iam.ecs_task_execution_role_arn
  user_task_role_arn          = module.iam.user_task_role_arn
  menu_task_role_arn          = module.iam.menu_task_role_arn
  order_task_role_arn         = module.iam.order_task_role_arn
  users_table_name            = module.dynamodb.users_table_name
  menu_table_name             = module.dynamodb.menu_table_name
  orders_table_name           = module.dynamodb.orders_table_name
  cognito_user_pool_id        = module.cognito.user_pool_id
  cognito_user_pool_client_id = module.cognito.user_pool_client_id
  internal_service_token      = var.service_internal_token
  frontend_origins            = local.frontend_origins
  desired_count               = var.desired_count
  cpu                         = var.ecs_cpu
  memory                      = var.ecs_memory
  log_retention_days          = var.log_retention_days
  tags                        = local.common_tags
}

module "cicd" {
  source = "../../modules/cicd"

  name_prefix                  = local.name_prefix
  github_connection_arn        = aws_codestarconnections_connection.restaurant.arn
  github_full_repository_id    = var.github_full_repository_id
  github_branch                = var.github_branch
  codepipeline_role_arn        = module.iam.codepipeline_role_arn
  terraform_codebuild_role_arn = module.iam.terraform_codebuild_role_arn
  frontend_codebuild_role_arn  = module.iam.frontend_codebuild_role_arn
  backend_codebuild_role_arn   = module.iam.backend_codebuild_role_arn
  payment_codebuild_role_arn   = module.iam.payment_codebuild_role_arn
  artifact_bucket_name         = local.artifact_bucket_name
  frontend_bucket_name         = module.frontend.frontend_bucket_name
  cloudfront_distribution_id   = module.frontend.cloudfront_distribution_id
  cloudfront_domain_name       = module.frontend.cloudfront_domain_name
  cognito_user_pool_id         = module.cognito.user_pool_id
  cognito_user_pool_client_id  = module.cognito.user_pool_client_id
  ecs_cluster_name             = module.ecs.ecs_cluster_name
  user_ecs_service_name        = module.ecs.user_ecs_service_name
  menu_ecs_service_name        = module.ecs.menu_ecs_service_name
  order_ecs_service_name       = module.ecs.order_ecs_service_name
  ecr_repository_urls          = module.ecr.repository_urls
  payment_lambda_name          = module.lambda.payment_lambda_name
  log_retention_days           = var.log_retention_days
  terraform_working_directory  = "terraform/environments/dev"
  tags                         = local.common_tags
}
