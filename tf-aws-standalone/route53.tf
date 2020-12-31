data "aws_route53_zone" "rootzone" {
  name = local.route53_root_fqdn
}
resource "aws_route53_record" "graphql" {
  name    = "graphql"
  type    = "A"
  zone_id = data.aws_route53_zone.rootzone.zone_id
  alias {
    evaluate_target_health = false
    name                   = aws_lb.alb.dns_name
    zone_id                = aws_lb.alb.zone_id
  }
}
