# CloudWatch Log Group for Backend Application
resource "aws_cloudwatch_log_group" "backend_app" {
  name              = "/chesster/backend"
  retention_in_days = 30

  tags = {
    Service = "chesster-backend"
  }
}

# IAM Policy for CloudWatch Logs access
resource "aws_iam_policy" "cloudwatch_logs" {
  name        = "ChessterCloudWatchLogs"
  description = "Allow backend service to write logs to CloudWatch"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogStream",
          "logs:PutLogEvents",
          "logs:DescribeLogStreams"
        ]
        Resource = "${aws_cloudwatch_log_group.backend_app.arn}:*"
      }
    ]
  })
}

# Attach CloudWatch policy to backend service user
resource "aws_iam_user_policy_attachment" "backend_service_cloudwatch" {
  user       = aws_iam_user.backend_service.name
  policy_arn = aws_iam_policy.cloudwatch_logs.arn
}

# Data source for current region
data "aws_region" "current" {}
