resource "aws_lb" "this" {
  name               = "${var.name_prefix}-alb"
  load_balancer_type = "application"
  internal           = true
  security_groups    = [var.alb_security_group_id]
  subnets            = [var.private_subnet_a_id, var.private_subnet_b_id]
  tags               = var.tags
}

locals {
  services = {
    user  = { port = 5001, path = "/api/users*" }
    menu  = { port = 5002, path = "/api/menu*" }
    order = { port = 5003, path = "/api/orders*" }
  }
}

resource "aws_lb_target_group" "service" {
  for_each    = local.services
  name        = "${var.name_prefix}-${each.key}-tg"
  port        = each.value.port
  protocol    = "HTTP"
  vpc_id      = var.vpc_id
  target_type = "ip"

  health_check {
    path                = "/health"
    matcher             = "200"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 3
  }

  tags = var.tags
}

resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.this.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type = "fixed-response"

    fixed_response {
      content_type = "application/json"
      message_body = "{\"success\":false,\"message\":\"Route not found\"}"
      status_code  = "404"
    }
  }
}

resource "aws_lb_listener_rule" "service" {
  for_each     = local.services
  listener_arn = aws_lb_listener.http.arn
  priority     = each.key == "user" ? 10 : each.key == "menu" ? 20 : 30

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.service[each.key].arn
  }

  condition {
    path_pattern {
      values = [each.value.path]
    }
  }
}
