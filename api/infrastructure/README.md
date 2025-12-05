# Legendary Waddle - AWS Lambda Terraform Configuration

This directory contains Terraform configurations to deploy the legendary-waddle application as an AWS Lambda function using Docker container images.

## Architecture

The configuration sets up:
- **AWS Lambda Function**: Runs the Docker image from `innfi/legendary-waddle`
- **IAM Role**: Execution role with permissions to pull from ECR and write logs
- **CloudWatch Logs**: Automatic log capture for monitoring

## Files

- `main.tf` - Core Lambda, IAM role, and CloudWatch resources
- `variables.tf` - Input variables with defaults
- `outputs.tf` - Output values for reference
- `terraform.tfvars.example` - Example variable values (copy to `terraform.tfvars` and customize)

## Prerequisites

1. AWS Account with appropriate permissions
2. Terraform >= 1.0
3. AWS credentials configured locally
4. Docker image published to `innfi/legendary-waddle` on Docker Hub (or ECR)

## Usage

### 1. Initialize Terraform

```bash
cd infrastructure
terraform init
```

### 2. Configure Variables

Copy the example variables file and customize:

```bash
cp terraform.tfvars.example terraform.tfvars
```

Edit `terraform.tfvars` with your specific values:
- AWS region
- Docker image details
- Lambda memory and timeout
- Environment variables
- VPC settings (optional)

### 3. Plan Deployment

```bash
terraform plan
```

### 4. Apply Configuration

```bash
terraform apply
```

### 5. Invoke Lambda Function

```bash
aws lambda invoke \
  --function-name legendary-waddle \
  --payload '{}' \
  response.json
```

## Configuration Options

### Required Variables
- None - all variables have defaults

### Important Variables
- `docker_image` - Default: `innfi/legendary-waddle`
- `docker_image_tag` - Default: `latest`
- `lambda_memory_size` - Default: 512 MB
- `lambda_timeout` - Default: 60 seconds

### VPC Configuration (Optional)
If your Lambda needs VPC access:
- `subnet_ids` - List of VPC subnet IDs
- `security_group_ids` - List of security group IDs

## Outputs

After applying, Terraform will output:
- `lambda_function_name` - Name of the created Lambda function
- `lambda_function_arn` - ARN for referencing the function
- `lambda_role_arn` - IAM role ARN
- `cloudwatch_log_group_name` - CloudWatch Logs group for function logs
- `image_uri` - The Docker image URI being used

## Updating the Docker Image

To update to a new image version:

```bash
# Update docker_image_tag in terraform.tfvars
terraform apply
```

## Cleanup

To destroy all AWS resources:

```bash
terraform destroy
```

## Notes

- The Lambda function uses the `Image` package type to run Docker containers
- Logs are automatically sent to CloudWatch with 7-day retention (configurable)
- The function assumes Docker Hub public images; for private registries, additional authentication setup is required
- For production, use a specific image tag instead of `latest`
