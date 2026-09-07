resource "aws_ecs_cluster" "this" {
  name = "${var.name_prefix}-cluster"
  tags = var.tags
}

resource "aws_service_discovery_http_namespace" "service_connect" {
  name        = "${var.name_prefix}.local"
  description = "Foodie WE Service Connect namespace"
  tags        = var.tags
}

locals {
  services = {
    user = {
      name      = "${var.name_prefix}-user-service"
      port      = 5001
      image     = "${var.ecr_repository_urls.user}:${var.bootstrap_image_tag}"
      task_role = var.user_task_role_arn
      env = {
        PORT                  = "5001"
        USERS_TABLE_NAME      = var.users_table_name
        COGNITO_USER_POOL_ID  = var.cognito_user_pool_id
        COGNITO_APP_CLIENT_ID = var.cognito_user_pool_client_id
        NODE_ENV              = "production"
      }
    }
    menu = {
      name      = "${var.name_prefix}-menu-service"
      port      = 5002
      image     = "${var.ecr_repository_urls.menu}:${var.bootstrap_image_tag}"
      task_role = var.menu_task_role_arn
      env = {
        PORT            = "5002"
        MENU_TABLE_NAME = var.menu_table_name
        NODE_ENV        = "production"
      }
    }
    order = {
      name      = "${var.name_prefix}-order-service"
      port      = 5003
      image     = "${var.ecr_repository_urls.order}:${var.bootstrap_image_tag}"
      task_role = var.order_task_role_arn
      env = {
        PORT                   = "5003"
        ORDERS_TABLE_NAME      = var.orders_table_name
        MENU_SERVICE_URL       = "http://menu:5002"
        INTERNAL_SERVICE_TOKEN = var.internal_service_token
        COGNITO_USER_POOL_ID   = var.cognito_user_pool_id
        COGNITO_APP_CLIENT_ID  = var.cognito_user_pool_client_id
        NODE_ENV               = "production"
      }
    }
  }
}

resource "aws_cloudwatch_log_group" "service" {
  for_each          = local.services
  name              = "/ecs/${each.value.name}"
  retention_in_days = var.log_retention_days
  tags              = var.tags
}

resource "aws_ecs_task_definition" "service" {
  for_each                 = local.services
  family                   = each.value.name
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = var.cpu
  memory                   = var.memory
  execution_role_arn       = var.task_execution_role_arn
  task_role_arn            = each.value.task_role

  container_definitions = jsonencode([
    {
      name      = each.key
      image     = each.value.image
      essential = true
      portMappings = [
        {
          containerPort = each.value.port
          hostPort      = each.value.port
          protocol      = "tcp"
          name          = "http"
        }
      ]
      environment = [
        for key, value in each.value.env : {
          name  = key
          value = value
        }
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = aws_cloudwatch_log_group.service[each.key].name
          awslogs-region        = var.aws_region
          awslogs-stream-prefix = each.key
        }
      }
      healthCheck = {
        command     = ["CMD-SHELL", "node -e \"fetch('http://localhost:${each.value.port}/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))\""]
        interval    = 30
        timeout     = 5
        retries     = 3
        startPeriod = 30
      }
    }
  ])

  tags = var.tags
}

resource "aws_ecs_service" "service" {
  for_each        = local.services
  name            = each.value.name
  cluster         = aws_ecs_cluster.this.id
  task_definition = aws_ecs_task_definition.service[each.key].arn
  desired_count   = var.desired_count
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = [var.private_subnet_a_id]
    security_groups  = [var.ecs_security_group_id]
    assign_public_ip = false
  }

  load_balancer {
    target_group_arn = var.target_group_arns[each.key]
    container_name   = each.key
    container_port   = each.value.port
  }

  dynamic "service_connect_configuration" {
    for_each = contains(["menu", "order"], each.key) ? [1] : []
    content {
      enabled   = true
      namespace = aws_service_discovery_http_namespace.service_connect.arn

      dynamic "service" {
        for_each = each.key == "menu" ? [1] : []
        content {
          port_name      = "http"
          discovery_name = "menu"

          client_alias {
            dns_name = "menu"
            port     = 5002
          }
        }
      }
    }
  }

  lifecycle {
    ignore_changes = [task_definition]
  }

  tags = var.tags
}
