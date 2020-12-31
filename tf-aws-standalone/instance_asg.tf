resource "aws_iam_role" "instance_role" {
  name_prefix        = local.app_name
  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "ec2.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
  tags               = { Name = local.app_name }
}

resource "aws_iam_instance_profile" "graphnode" {
  name_prefix = local.app_name
  role        = aws_iam_role.instance_role.name
}

data "aws_iam_policy_document" "graphnode-ssm-parmas" {
  ### maybe you needed access to your parameters
  statement {
    actions = [
      "ssm:DescribeParameters"
    ]
    resources = [
    "*"]
  }
  statement {
    actions = [
      "ssm:GetParameters",
    ]
    resources = ["arn:aws:ssm:${local.region}:${data.aws_caller_identity.this.account_id}:parameter/${trim(local.eth_node_ssm_name, "/")}"]
  }
}

resource "aws_iam_role_policy" "graph-node-instance-profile" {
  name   = "graph-node-instance-policy"
  role   = aws_iam_role.instance_role.id
  policy = data.aws_iam_policy_document.graphnode-ssm-parmas.json
}

###TODO break out the rules into aws_security_group_rule statements each with their own description
resource "aws_security_group" "graph-node" {
  name_prefix = local.app_name
  description = "ssh + graph-node ports"
  vpc_id      = local.vpc_id

  ingress {
    protocol    = "TCP"
    from_port   = 22
    to_port     = 22
    cidr_blocks = ["0.0.0.0/0"]
  }
  ingress {
    ## GraphQL http
    protocol    = "TCP"
    from_port   = 8000
    to_port     = 8000
    cidr_blocks = [local.vpc_cidr] ## change to 0.0.0.0 to allow direct access to the nodes from the internet
  }
  ingress {
    ## JSON-RPC admin
    protocol    = "TCP"
    from_port   = 8020
    to_port     = 8020
    cidr_blocks = [local.vpc_cidr] ## change to 0.0.0.0 to allow direct access to the nodes from the internet
  }
  ingress {
    ## Index Node Server
    protocol    = "TCP"
    from_port   = 8030
    to_port     = 8030
    cidr_blocks = [local.vpc_cidr] ## change to 0.0.0.0 to allow direct access to the nodes from the internet
  }
  ingress {
    ## Metrics
    protocol    = "TCP"
    from_port   = 8040
    to_port     = 8040
    cidr_blocks = [local.vpc_cidr] ## change to 0.0.0.0 to allow direct access to the nodes from the internet
  }
  egress {
    protocol    = "-1"
    from_port   = 0
    to_port     = 0
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = { Name = "graph-node-sg" }
}

##TODO figure out a way to provide different graphs to userdata, right now this always grabs the badger one
## could accept a list of name/repo tuples and parse a more complex userdata
data "template_file" "userdata" {
  template = file("templates/userdata.sh.template")
  vars = {
    graphnode_url_ssm_arn = local.eth_node_ssm_name
    region                = var.region
  }
}

data "aws_ami" "amazon-linux" {
  most_recent = true
  owners      = ["amazon"]
  filter {
    name   = "name"
    values = ["amzn-ami-*-x86_64-gp2"]
  }
  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
  filter {
    name   = "owner-alias"
    values = ["amazon"]
  }
}

resource "aws_launch_configuration" "graphnode" {
  name_prefix                 = local.app_name
  image_id                    = data.aws_ami.amazon-linux.id
  instance_type               = local.instance_type
  iam_instance_profile        = aws_iam_instance_profile.graphnode.name
  security_groups             = [aws_security_group.graph-node.id]
  associate_public_ip_address = true ## for ssh until we have a private network
  user_data                   = data.template_file.userdata.rendered
  key_name                    = local.ssh_key_pair_name
  root_block_device {
    volume_size           = local.instance_storage_size
    volume_type           = "gp2"
    delete_on_termination = true
  }
}
/*
resource "aws_launch_template" "graphnode" {
  name_prefix = local.app_name
  image_id = data.aws_ami.amazon-linux.id
  instance_type = local.instance_type
  ebs_optimized = true
  key_name = local.ssh_key_pair_name
  vpc_security_group_ids = [aws_security_group.graph-node.id]
  user_data = base64encode(data.template_file.userdata.rendered)
  tags = {Name = local.app_name}
  block_device_mappings {
    device_name = data.aws_ami.amazon-linux.root_device_name
    ebs {
      volume_size = local.instance_storage_size
      volume_type = "gp3"
      delete_on_termination = true
    }
  }
  lifecycle {
    ignore_changes = [
      image_id]
    ## Don't rebuild instances by default every time there is a newer AMI when terraform runs
  }
  iam_instance_profile {
    arn = aws_iam_instance_profile.graphnode.arn
  }
  tag_specifications {
    resource_type = "instance"
    tags          =  { Name = local.app_name}
  }

}
*/

##TODO write autoscaling policies once we understand application load
## Right now this asg basically will just keep local.desired_nodes running
resource "aws_autoscaling_group" "autopilot_worker" {
  desired_capacity     = local.desired_nodes
  max_size             = local.max_nodes
  min_size             = local.min_nodes
  health_check_type    = "EC2"
  vpc_zone_identifier  = local.subnets
  target_group_arns    = [aws_lb_target_group.graphnode-graphql.arn]
  launch_configuration = aws_launch_configuration.graphnode.id

  lifecycle {
    ignore_changes        = [desired_capacity]
    create_before_destroy = true
  }
}

