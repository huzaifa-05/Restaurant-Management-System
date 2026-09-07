output "frontend_bucket_name" {
  description = "Name of the S3 bucket that hosts frontend build artifacts."
  value       = aws_s3_bucket.frontend.bucket
}

output "frontend_bucket_arn" {
  description = "ARN of the S3 bucket that hosts frontend build artifacts."
  value       = aws_s3_bucket.frontend.arn
}

output "cloudfront_distribution_id" {
  description = "ID of the CloudFront distribution serving the frontend and /api routes."
  value       = aws_cloudfront_distribution.this.id
}

output "cloudfront_distribution_arn" {
  description = "ARN of the CloudFront distribution serving the frontend and /api routes."
  value       = aws_cloudfront_distribution.this.arn
}

output "cloudfront_domain_name" {
  description = "Domain name of the CloudFront distribution."
  value       = aws_cloudfront_distribution.this.domain_name
}

output "cloudfront_hosted_zone_id" {
  description = "Hosted zone ID for the CloudFront distribution."
  value       = aws_cloudfront_distribution.this.hosted_zone_id
}
