variable "aws_region" {
  type        = string
  description = "AWS region"
  default     = "us-east-1"
}

variable "docker_image" {
  type        = string
  description = "Docker image URI"
  default     = "innfi/legendary-waddle"
}

variable "docker_image_tag" {
  type        = string
  description = "Docker image tag"
  default     = "latest"
}

variable "lambda_timeout" {
  type        = number
  description = "Lambda function timeout in seconds"
  default     = 60
}

variable "lambda_memory_size" {
  type        = number
  description = "Lambda function memory in MB"
  default     = 512
}

variable "environment_variables" {
  type        = map(string)
  description = "Environment variables for Lambda function"
  default     = {}
}

variable "subnet_ids" {
  type        = list(string)
  description = "VPC Subnet IDs for Lambda (optional, leave empty for no VPC)"
  default     = []
}

variable "security_group_ids" {
  type        = list(string)
  description = "VPC Security Group IDs for Lambda (optional)"
  default     = []
}

variable "log_retention_days" {
  type        = number
  description = "CloudWatch log retention in days"
  default     = 7
}
