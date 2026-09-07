resource "aws_s3_bucket" "artifacts" {
  bucket = var.artifact_bucket_name
  tags   = merge(var.tags, { Name = var.artifact_bucket_name })
}

resource "aws_s3_bucket_versioning" "artifacts" {
  bucket = aws_s3_bucket.artifacts.id
  versioning_configuration {
    status = "Enabled"
  }
}

locals {
  source_action = {
    owner            = "AWS"
    provider         = "CodeStarSourceConnection"
    version          = "1"
    output_artifacts = ["SourceOutput"]
    configuration = {
      ConnectionArn        = var.github_connection_arn
      FullRepositoryId     = var.github_full_repository_id
      BranchName           = var.github_branch
      OutputArtifactFormat = "CODEBUILD_CLONE_REF"
    }
  }
}

resource "aws_codebuild_project" "terraform_validate" {
  name         = "${var.name_prefix}-terraform-validate"
  service_role = var.terraform_codebuild_role_arn
  tags         = var.tags

  artifacts { type = "CODEPIPELINE" }
  source {
    type      = "CODEPIPELINE"
    buildspec = "buildspec/terraform-validate.yml"
  }
  environment {
    compute_type = "BUILD_GENERAL1_SMALL"
    image        = "aws/codebuild/standard:7.0"
    type         = "LINUX_CONTAINER"
    environment_variable {
      name  = "TF_WORKING_DIR"
      value = var.terraform_working_directory
    }
  }
}

resource "aws_codebuild_project" "terraform_plan" {
  name         = "${var.name_prefix}-terraform-plan"
  service_role = var.terraform_codebuild_role_arn
  tags         = var.tags

  artifacts { type = "CODEPIPELINE" }
  source {
    type      = "CODEPIPELINE"
    buildspec = "buildspec/terraform-plan.yml"
  }
  environment {
    compute_type = "BUILD_GENERAL1_SMALL"
    image        = "aws/codebuild/standard:7.0"
    type         = "LINUX_CONTAINER"
    environment_variable {
      name  = "TF_WORKING_DIR"
      value = var.terraform_working_directory
    }
  }
}

resource "aws_codebuild_project" "terraform_apply" {
  name         = "${var.name_prefix}-terraform-apply"
  service_role = var.terraform_codebuild_role_arn
  tags         = var.tags

  artifacts { type = "CODEPIPELINE" }
  source {
    type      = "CODEPIPELINE"
    buildspec = "buildspec/terraform-apply.yml"
  }
  environment {
    compute_type = "BUILD_GENERAL1_SMALL"
    image        = "aws/codebuild/standard:7.0"
    type         = "LINUX_CONTAINER"
    environment_variable {
      name  = "TF_WORKING_DIR"
      value = var.terraform_working_directory
    }
  }
}

resource "aws_codebuild_project" "frontend" {
  name         = "${var.name_prefix}-frontend"
  service_role = var.frontend_codebuild_role_arn
  tags         = var.tags

  artifacts { type = "CODEPIPELINE" }
  source {
    type      = "CODEPIPELINE"
    buildspec = "buildspec/frontend.yml"
  }
  environment {
    compute_type = "BUILD_GENERAL1_SMALL"
    image        = "aws/codebuild/standard:7.0"
    type         = "LINUX_CONTAINER"
    environment_variable {
      name  = "FRONTEND_BUCKET_NAME"
      value = var.frontend_bucket_name
    }
    environment_variable {
      name  = "CLOUDFRONT_DISTRIBUTION_ID"
      value = var.cloudfront_distribution_id
    }
    environment_variable {
      name  = "VITE_API_BASE_URL"
      value = "https://${var.cloudfront_domain_name}"
    }
  }
}

resource "aws_codebuild_project" "backend_ecs" {
  name         = "${var.name_prefix}-backend-ecs"
  service_role = var.backend_codebuild_role_arn
  tags         = var.tags

  artifacts { type = "CODEPIPELINE" }
  source {
    type      = "CODEPIPELINE"
    buildspec = "buildspec/backend-ecs.yml"
  }
  environment {
    compute_type                = "BUILD_GENERAL1_MEDIUM"
    image                       = "aws/codebuild/standard:7.0"
    type                        = "LINUX_CONTAINER"
    privileged_mode             = true
    image_pull_credentials_type = "CODEBUILD"

    environment_variable {
      name  = "ECS_CLUSTER_NAME"
      value = var.ecs_cluster_name
    }
    environment_variable {
      name  = "USER_SERVICE_NAME"
      value = var.user_ecs_service_name
    }
    environment_variable {
      name  = "MENU_SERVICE_NAME"
      value = var.menu_ecs_service_name
    }
    environment_variable {
      name  = "ORDER_SERVICE_NAME"
      value = var.order_ecs_service_name
    }
    environment_variable {
      name  = "USER_ECR_REPOSITORY_URL"
      value = var.ecr_repository_urls.user
    }
    environment_variable {
      name  = "MENU_ECR_REPOSITORY_URL"
      value = var.ecr_repository_urls.menu
    }
    environment_variable {
      name  = "ORDER_ECR_REPOSITORY_URL"
      value = var.ecr_repository_urls.order
    }
  }
}

resource "aws_codebuild_project" "payment_lambda" {
  name         = "${var.name_prefix}-payment-lambda"
  service_role = var.payment_codebuild_role_arn
  tags         = var.tags

  artifacts { type = "CODEPIPELINE" }
  source {
    type      = "CODEPIPELINE"
    buildspec = "buildspec/payment-lambda.yml"
  }
  environment {
    compute_type = "BUILD_GENERAL1_SMALL"
    image        = "aws/codebuild/standard:7.0"
    type         = "LINUX_CONTAINER"
    environment_variable {
      name  = "PAYMENT_LAMBDA_NAME"
      value = var.payment_lambda_name
    }
  }
}

resource "aws_codepipeline" "terraform" {
  name          = "${var.name_prefix}-terraform"
  role_arn      = var.codepipeline_role_arn
  pipeline_type = "V2"
  tags          = var.tags

  trigger {
    provider_type = "CodeStarSourceConnection"
    git_configuration {
      source_action_name = "Source"

      push {
        branches {
          includes = [var.github_branch]
        }

        file_paths {
          includes = ["terraform/**"]
        }
      }
    }
  }

  artifact_store {
    location = aws_s3_bucket.artifacts.bucket
    type     = "S3"
  }

  stage {
    name = "Source"
    action {
      name             = "Source"
      category         = "Source"
      owner            = local.source_action.owner
      provider         = local.source_action.provider
      version          = local.source_action.version
      output_artifacts = local.source_action.output_artifacts
      configuration    = local.source_action.configuration
    }
  }

  stage {
    name = "Validate"
    action {
      name             = "Validate"
      category         = "Build"
      owner            = "AWS"
      provider         = "CodeBuild"
      version          = "1"
      input_artifacts  = ["SourceOutput"]
      output_artifacts = ["ValidateOutput"]
      configuration    = { ProjectName = aws_codebuild_project.terraform_validate.name }
    }
  }

  stage {
    name = "Plan"
    action {
      name             = "Plan"
      category         = "Build"
      owner            = "AWS"
      provider         = "CodeBuild"
      version          = "1"
      input_artifacts  = ["SourceOutput"]
      output_artifacts = ["PlanOutput"]
      configuration    = { ProjectName = aws_codebuild_project.terraform_plan.name }
    }
  }

  stage {
    name = "ManualApproval"
    action {
      name     = "Approve"
      category = "Approval"
      owner    = "AWS"
      provider = "Manual"
      version  = "1"
    }
  }

  stage {
    name = "Apply"
    action {
      name            = "Apply"
      category        = "Build"
      owner           = "AWS"
      provider        = "CodeBuild"
      version         = "1"
      input_artifacts = ["SourceOutput", "PlanOutput"]
      configuration   = { ProjectName = aws_codebuild_project.terraform_apply.name, PrimarySource = "SourceOutput" }
    }
  }
}

resource "aws_codepipeline" "application" {
  name          = "${var.name_prefix}-application"
  role_arn      = var.codepipeline_role_arn
  pipeline_type = "V2"
  tags          = var.tags

  trigger {
    provider_type = "CodeStarSourceConnection"
    git_configuration {
      source_action_name = "Source"

      push {
        branches {
          includes = [var.github_branch]
        }

        file_paths {
          includes = [
            "frontend/**",
            "services/user-service/**",
            "services/menu-service/**",
            "services/order-service/**",
            "services/payment-service/**"
          ]
        }
      }
    }
  }

  artifact_store {
    location = aws_s3_bucket.artifacts.bucket
    type     = "S3"
  }

  stage {
    name = "Source"
    action {
      name             = "Source"
      category         = "Source"
      owner            = local.source_action.owner
      provider         = local.source_action.provider
      version          = local.source_action.version
      output_artifacts = local.source_action.output_artifacts
      configuration    = local.source_action.configuration
    }
  }

  stage {
    name = "BuildDeployFrontend"
    action {
      name            = "BuildDeployFrontend"
      category        = "Build"
      owner           = "AWS"
      provider        = "CodeBuild"
      version         = "1"
      input_artifacts = ["SourceOutput"]
      configuration   = { ProjectName = aws_codebuild_project.frontend.name }
    }
  }
  stage {
    name = "BuildDeployBackendECS"
    action {
      name            = "BuildDeployChangedServices"
      category        = "Build"
      owner           = "AWS"
      provider        = "CodeBuild"
      version         = "1"
      input_artifacts = ["SourceOutput"]
      configuration   = { ProjectName = aws_codebuild_project.backend_ecs.name }
    }
  }
  stage {
    name = "BuildDeployPaymentLambda"
    action {
      name            = "BuildDeployPaymentLambda"
      category        = "Build"
      owner           = "AWS"
      provider        = "CodeBuild"
      version         = "1"
      input_artifacts = ["SourceOutput"]
      configuration   = { ProjectName = aws_codebuild_project.payment_lambda.name }
    }
  }
}
