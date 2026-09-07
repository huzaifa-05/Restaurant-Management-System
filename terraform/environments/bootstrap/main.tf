data "aws_caller_identity" "current" {}

locals {
  state_bucket_name = coalesce(
    var.state_bucket_name,
    "${var.project_name}-terraform-state-${data.aws_caller_identity.current.account_id}"
  )

  common_tags = {
    Project     = "Foodie-WE"
    Environment = "Restaurant Management system"
    ManagedBy   = "Terraform"
    Owner       = var.owner
  }
}

module "remote_state" {
  source = "../../modules/remote_state"

  bucket_name                       = local.state_bucket_name
  noncurrent_version_retention_days = var.noncurrent_version_retention_days
  tags                              = local.common_tags
}
