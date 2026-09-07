output "artifact_bucket_name" {
  description = "Name of the S3 bucket used for CI/CD artifacts."
  value       = aws_s3_bucket.artifacts.bucket
}

output "artifact_bucket_arn" {
  description = "ARN of the S3 bucket used for CI/CD artifacts."
  value       = aws_s3_bucket.artifacts.arn
}

output "terraform_pipeline_name" {
  description = "Name of the Terraform infrastructure CodePipeline."
  value       = aws_codepipeline.terraform.name
}

output "application_pipeline_name" {
  description = "Name of the single application CodePipeline for frontend, ECS services, and Payment Lambda."
  value       = aws_codepipeline.application.name
}

output "codebuild_project_arns" {
  description = "ARNs of CodeBuild projects that CodePipeline can start."
  value = [
    aws_codebuild_project.terraform_validate.arn,
    aws_codebuild_project.terraform_plan.arn,
    aws_codebuild_project.terraform_apply.arn,
    aws_codebuild_project.frontend.arn,
    aws_codebuild_project.backend_ecs.arn,
    aws_codebuild_project.payment_lambda.arn
  ]
}
