locals {
  assume_role_policies = {
    ecs_tasks    = templatefile("${path.module}/templates/assume_role/ecs_tasks.tftpl", {})
    lambda       = templatefile("${path.module}/templates/assume_role/lambda.tftpl", {})
    codebuild    = templatefile("${path.module}/templates/assume_role/codebuild.tftpl", {})
    codepipeline = templatefile("${path.module}/templates/assume_role/codepipeline.tftpl", {})
  }

  lambda_log_resources = [
    "arn:aws:logs:${data.aws_region.current.region}:${data.aws_caller_identity.current.account_id}:log-group:/aws/lambda/${var.name_prefix}-*:*"
  ]

  codebuild_log_resources = [
    "arn:aws:logs:${data.aws_region.current.region}:${data.aws_caller_identity.current.account_id}:log-group:/aws/codebuild/${var.name_prefix}-*"
  ]

  artifact_bucket_resources = [
    var.artifact_bucket_arn,
    "${var.artifact_bucket_arn}/*"
  ]

  backend_ecs_pass_role_arns = [
    aws_iam_role.ecs_task_execution.arn,
    aws_iam_role.user_task.arn,
    aws_iam_role.menu_task.arn,
    aws_iam_role.order_task.arn
  ]

  payment_lambda_arn = "arn:aws:lambda:${data.aws_region.current.region}:${data.aws_caller_identity.current.account_id}:function:${var.payment_lambda_name}"

  terraform_codebuild_infrastructure_actions = [
    "ec2:*",
    "ecs:*",
    "elasticloadbalancing:*",
    "cloudfront:*",
    "s3:*",
    "dynamodb:*",
    "lambda:*",
    "apigateway:*",
    "apigatewayv2:*",
    "cognito-idp:*",
    "ecr:*",
    "cloudwatch:*",
    "logs:*",
    "codebuild:*",
    "codepipeline:*",
    "codestar-connections:UseConnection",
    "codeconnections:UseConnection",
    "iam:GetRole",
    "iam:CreateRole",
    "iam:DeleteRole",
    "iam:PutRolePolicy",
    "iam:DeleteRolePolicy",
    "iam:AttachRolePolicy",
    "iam:DetachRolePolicy",
    "iam:PassRole",
    "iam:TagRole",
    "iam:UntagRole"
  ]
}
