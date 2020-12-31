## Note, to make things understandable, all code uses locals
## All variables should be mapped to locals in vars_to_locals.tf
## Other locals can go here too, or in-line with code when it makes sense
variable "ethnode_url_ssm_parameter_name" {
  type        = string
  description = "the name of an ssm parameter that holds the URL of the ethnode we will use"
}
variable "app_name" {
  type        = string
  description = "The name of the application that will be used for tagging."
  default     = "local-graphnode-cluster"
}
variable "aws_keypair_name" {
  type        = string
  description = "The name of the ssh keypair to use in order to allow access."
}
variable "route53_root_fqdn" {
  type        = string
  description = "Root route53 domain name that we should build records on top of."
}
variable "region" {
  type        = string
  description = "The aws region to deploy into."
}
variable "public_subnet_ids" {
  type        = list(string)
  default     = null
  description = "A list of public subnets in the vpc, if null use default vpc."
}
variable "vpc_id" {
  type        = string
  default     = null
  description = "The VPC to deploy into, if null use default vpc."
}
##TODO add support for private subents
variable "asg_details" {
  type = object({ instance_type = string, min_nodes = number, desired_nodes = number, max_nodes = number, storage_size_gb = number })
  default = {
    instance_type   = "t2.medium"
    min_nodes       = 1
    max_nodes       = 1
    desired_nodes   = 1
    storage_size_gb = "15"
  }
  description = "How many of which instance type for the autoscailing group.  Defaults to 1 t2.micro for free tier."
}

