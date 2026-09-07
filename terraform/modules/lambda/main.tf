data "archive_file" "payment" {
  type        = "zip"
  source_dir  = var.payment_source_dir
  output_path = "${path.module}/payment-service.zip"
}

resource "aws_cloudwatch_log_group" "payment" {
  name              = "/aws/lambda/${var.name_prefix}-payment"
  retention_in_days = var.log_retention_days
  tags              = var.tags
}

resource "aws_lambda_function" "payment" {
  function_name    = "${var.name_prefix}-payment"
  role             = var.payment_lambda_role_arn
  handler          = "handler.handler"
  runtime          = "nodejs20.x"
  filename         = data.archive_file.payment.output_path
  source_code_hash = data.archive_file.payment.output_base64sha256
  timeout          = var.lambda_timeout_seconds

  environment {
    variables = {
      NODE_ENV             = "production"
      PAYMENTS_TABLE_NAME  = var.payments_table_name
      PAYMENT_SUCCESS_RATE = var.payment_success_rate
    }
  }

  depends_on = [aws_cloudwatch_log_group.payment]
  tags       = var.tags
}
