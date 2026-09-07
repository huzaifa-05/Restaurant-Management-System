locals {
  repositories = {
    user  = "foodie-we-user-service"
    menu  = "foodie-we-menu-service"
    order = "foodie-we-order-service"
  }
}

resource "aws_ecr_repository" "service" {
  for_each             = local.repositories
  name                 = each.value
  image_tag_mutability = "IMMUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = merge(var.tags, { Name = "${var.name_prefix}-${each.key}-ecr" })
}

resource "aws_ecr_lifecycle_policy" "service" {
  for_each   = aws_ecr_repository.service
  repository = each.value.name

  policy = jsonencode({
    rules = [{
      rulePriority = 1
      description  = "Retain recent images"
      selection = {
        tagStatus   = "any"
        countType   = "imageCountMoreThan"
        countNumber = var.retain_image_count
      }
      action = { type = "expire" }
    }]
  })
}
