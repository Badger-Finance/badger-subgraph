output "access_url" {
  value = "http://${aws_route53_record.graphql.fqdn}" ## TODO change if we change to https or url formats
}

