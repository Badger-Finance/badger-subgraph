resource "aws_lb" "alb" {
  name               = "alb"
  load_balancer_type = "application"
  subnets            = local.subnets
  security_groups    = [aws_security_group.graph-node.id]
  internal           = false
  tags = {
    Name = "alb"
  }
}

resource "aws_lb_target_group" "graphnode-graphql" {
  name     = "alb-target-group"
  port     = "8000"
  protocol = "HTTP"
  vpc_id   = local.vpc_id
  tags = {
    name = "graphql"
  }
  health_check { ##TODO figure out a better healthcheck maybe getting data from the monitoring/management ports
    healthy_threshold   = 3
    unhealthy_threshold = 10
    timeout             = 5
    interval            = 10
    path                = "/"
    port                = 8000
  }
}

## TODO ports 8020[JSON-RPC admin], 8030[IndexNode], 8040[Metrics] may need to be exposed to the internet
## If so they need their own target groups.
resource "aws_lb_listener" "graphnode-graphql" { ##TODO consider moving to https
  load_balancer_arn = aws_lb.alb.arn
  port              = 80 ##TODO verify that it's ok to use 80 and 443 to access apis via load balancing
  protocol          = "HTTP"

  default_action {
    target_group_arn = aws_lb_target_group.graphnode-graphql.arn
    type             = "forward"
  }
}

resource "aws_autoscaling_attachment" "graphnode-graphql" {
  alb_target_group_arn   = aws_lb_target_group.graphnode-graphql.arn
  autoscaling_group_name = aws_autoscaling_group.autopilot_worker.name
}
