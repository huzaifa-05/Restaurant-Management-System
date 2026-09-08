data "aws_caller_identity" "current" {}
data "aws_region" "current" {}

resource "aws_iam_role" "ecs_task_execution" {
  name               = "${var.name_prefix}-ecs-task-execution"
  assume_role_policy = local.assume_role_policies.ecs_tasks
  tags               = var.tags
}

resource "aws_iam_role_policy_attachment" "ecs_task_execution_managed" {
  role       = aws_iam_role.ecs_task_execution.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_iam_role" "user_task" {
  name               = "${var.name_prefix}-user-task"
  assume_role_policy = local.assume_role_policies.ecs_tasks
  tags               = var.tags
}

resource "aws_iam_role_policy" "user_task" {
  name = "${var.name_prefix}-user-task-ddb"
  role = aws_iam_role.user_task.id

  policy = templatefile("${path.module}/templates/iam_policy/user_task.tftpl", {
    users_table_resources = jsonencode([
      var.users_table_arn,
      "${var.users_table_arn}/index/*"
    ])
  })
}

resource "aws_iam_role" "menu_task" {
  name               = "${var.name_prefix}-menu-task"
  assume_role_policy = local.assume_role_policies.ecs_tasks
  tags               = var.tags
}

resource "aws_iam_role_policy" "menu_task" {
  name = "${var.name_prefix}-menu-task-ddb"
  role = aws_iam_role.menu_task.id

  policy = templatefile("${path.module}/templates/iam_policy/menu_task.tftpl", {
    menu_table_resources = jsonencode([
      var.menu_table_arn,
      "${var.menu_table_arn}/index/*"
    ])
  })
}

resource "aws_iam_role" "order_task" {
  name               = "${var.name_prefix}-order-task"
  assume_role_policy = local.assume_role_policies.ecs_tasks
  tags               = var.tags
}

resource "aws_iam_role_policy" "order_task" {
  name = "${var.name_prefix}-order-task-ddb"
  role = aws_iam_role.order_task.id

  policy = templatefile("${path.module}/templates/iam_policy/order_task.tftpl", {
    orders_table_resources = jsonencode([
      var.orders_table_arn,
      "${var.orders_table_arn}/index/*"
    ])
  })
}

resource "aws_iam_role" "payment_lambda" {
  name               = "${var.name_prefix}-payment-lambda"
  assume_role_policy = local.assume_role_policies.lambda
  tags               = var.tags
}

resource "aws_iam_role_policy" "payment_lambda" {
  name = "${var.name_prefix}-payment-lambda-policy"
  role = aws_iam_role.payment_lambda.id

  policy = templatefile("${path.module}/templates/iam_policy/payment_lambda.tftpl", {
    log_resources = jsonencode(local.lambda_log_resources)
    payments_table_resources = jsonencode([
      var.payments_table_arn,
      "${var.payments_table_arn}/index/*"
    ])
  })
}

resource "aws_iam_role_policy_attachment" "payment_lambda_vpc_access" {
  role       = aws_iam_role.payment_lambda.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole"
}

resource "aws_iam_role" "codepipeline" {
  name               = "${var.name_prefix}-codepipeline"
  assume_role_policy = local.assume_role_policies.codepipeline
  tags               = var.tags
}

resource "aws_iam_role_policy" "codepipeline" {
  name = "${var.name_prefix}-codepipeline-policy"
  role = aws_iam_role.codepipeline.id

  policy = templatefile("${path.module}/templates/iam_policy/codepipeline.tftpl", {
    artifact_bucket_resources = jsonencode(local.artifact_bucket_resources)
    codebuild_project_arns    = jsonencode(var.codebuild_project_arns)
    codeconnection_arn        = var.codeconnection_arn
  })
}

resource "aws_iam_role" "terraform_codebuild" {
  name               = "${var.name_prefix}-terraform-codebuild"
  assume_role_policy = local.assume_role_policies.codebuild
  tags               = var.tags
}

resource "aws_iam_role_policy" "terraform_codebuild" {
  name = "${var.name_prefix}-terraform-codebuild-policy"
  role = aws_iam_role.terraform_codebuild.id

  policy = templatefile("${path.module}/templates/iam_policy/terraform_codebuild.tftpl", {
    artifact_bucket_resources = jsonencode(local.artifact_bucket_resources)
    codeconnection_arn        = var.codeconnection_arn
    infrastructure_actions    = jsonencode(local.terraform_codebuild_infrastructure_actions)
    log_resources             = jsonencode(local.codebuild_log_resources)
  })
}

resource "aws_iam_role" "frontend_codebuild" {
  name               = "${var.name_prefix}-frontend-codebuild"
  assume_role_policy = local.assume_role_policies.codebuild
  tags               = var.tags
}

resource "aws_iam_role_policy" "frontend_codebuild" {
  name = "${var.name_prefix}-frontend-codebuild-policy"
  role = aws_iam_role.frontend_codebuild.id

  policy = templatefile("${path.module}/templates/iam_policy/frontend_codebuild.tftpl", {
    cloudfront_distribution_arn = var.cloudfront_distribution_arn
    codeconnection_arn          = var.codeconnection_arn
    artifact_bucket_resources   = jsonencode(local.artifact_bucket_resources)
    frontend_bucket_arn         = var.frontend_bucket_arn
    log_resources               = jsonencode(local.codebuild_log_resources)
  })
}

resource "aws_iam_role" "backend_codebuild" {
  name               = "${var.name_prefix}-backend-codebuild"
  assume_role_policy = local.assume_role_policies.codebuild
  tags               = var.tags
}

resource "aws_iam_role_policy" "backend_codebuild" {
  name = "${var.name_prefix}-backend-codebuild-policy"
  role = aws_iam_role.backend_codebuild.id

  policy = templatefile("${path.module}/templates/iam_policy/backend_codebuild.tftpl", {
    artifact_bucket_resources = jsonencode(local.artifact_bucket_resources)
    codeconnection_arn        = var.codeconnection_arn
    ecr_repository_arns       = jsonencode(var.ecr_repository_arns)
    log_resources             = jsonencode(local.codebuild_log_resources)
    pass_role_arns            = jsonencode(local.backend_ecs_pass_role_arns)
  })
}

resource "aws_iam_role" "payment_codebuild" {
  name               = "${var.name_prefix}-payment-codebuild"
  assume_role_policy = local.assume_role_policies.codebuild
  tags               = var.tags
}

resource "aws_iam_role_policy" "payment_codebuild" {
  name = "${var.name_prefix}-payment-codebuild-policy"
  role = aws_iam_role.payment_codebuild.id

  policy = templatefile("${path.module}/templates/iam_policy/payment_codebuild.tftpl", {
    artifact_bucket_arn       = var.artifact_bucket_arn
    artifact_bucket_resources = jsonencode(local.artifact_bucket_resources)
    codeconnection_arn        = var.codeconnection_arn
    log_resources             = jsonencode(local.codebuild_log_resources)
    payment_lambda_arn        = local.payment_lambda_arn
  })
}
