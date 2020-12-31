locals {
  app_name              = var.app_name
  eth_node_ssm_name     = var.ethnode_url_ssm_parameter_name
  ssh_key_pair_name     = var.aws_keypair_name
  route53_root_fqdn     = var.route53_root_fqdn
  region                = var.region
  instance_type         = var.asg_details.instance_type
  instance_storage_size = var.asg_details.storage_size_gb
  min_nodes             = var.asg_details.min_nodes
  max_nodes             = var.asg_details.max_nodes
  desired_nodes         = var.asg_details.desired_nodes
}


