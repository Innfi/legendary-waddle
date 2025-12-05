output "lambda_function_name" {
  value       = aws_lambda_function.legendary_waddle.function_name
  description = "Name of the Lambda function"
}

output "lambda_function_arn" {
  value       = aws_lambda_function.legendary_waddle.arn
  description = "ARN of the Lambda function"
}

output "lambda_role_arn" {
  value       = aws_iam_role.lambda_role.arn
  description = "ARN of the Lambda execution role"
}

output "cloudwatch_log_group_name" {
  value       = aws_cloudwatch_log_group.lambda_logs.name
  description = "CloudWatch Log Group name"
}

output "image_uri" {
  value       = aws_lambda_function.legendary_waddle.image_uri
  description = "The image URI used by Lambda"
}
