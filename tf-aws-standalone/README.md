# Stand-alone server IAC

This directory will grow into everything needed to deploy a cluster of stand-alone graph nodes in an aws account using terraform
Note that there is a lot of terraform here. If you use intelliJ or vscode, install the terraform plugin and your life will be WAY better!

## Setting up to use terraform

#### Setup access keys and aws cli

Terraform accesses aws through the aws-cli. To run, it needs full admin access to the account.
In order for terraform to run many of the following environment variables must be set

| env var               | value                                                                                                                                           |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| AWS_REGION            | The aws region to connect to ie "us-east-1"                                                                                                     |
| AWS_ACCESS_KEY_ID     | An aws access key id with full admin access to the account                                                                                      |
| AWS_SECRET_ACCESS_KEY | The secret to match the above key_id                                                                                                            |
| AWS_PROFILE           | If you have the aws cli setup and something in your ~/.aws/credentials file, you can reference that name instead of the key and id listed above |

#### Create an s3 bucket and dynamodb table for terraform to use

Terraform needs an s3 bucket to hold its state, and a dynamodb table to handle locking for said state.
These 2 resources must be manually created.

You can read more about terraform backends here: https://www.terraform.io/docs/backends/types/s3.html

Note that if you already have terraform infrastructure setup, just use that.

S3

- Login to the aws console
- Go to S3
- Set bucket name recommend you start with tfstate-
- Set the region to match the region used above
- Block all public access
- Enable versioning (highly recommended)
- Enable server side encryption (recommended) (the amazon s3 key is fine or you can do kms stuff)
- Create the bucket
- go to main.tf line 6 and change bucket = to match your bucket name (can also pass via commandline)

dynamodb

- In aws console search for the dynamodb service
- Change your region to match the region used
- click create table
- name the table tfstate-locking
- set the primary key to LockID with type string
- everything else can stay default

S3 can be slow to launch new buckets 100%. Go get a coffee and come back in 5-10 minutes to continue
**TODO: figure out CLI commands for these**

In the same directory as this readme, run terraform init. If all went well you should see

"Terraform has been successfully initialized!"

## Setting an ssm parameter for the eth node URL

The ethnode URL is something we might not want to share with the world, and can not be part of a public repo. In order
to handle this, the URL is pulled from aws SSM.

To set the parameter:

- go parameter store: https://console.aws.amazon.com/systems-manager/parameters?region=us-east-1
- Click create parameter
- Enter a name (can have a path) for example /secrets/graphnode/ethnode_url
- Select standard tier and type string
- Set Date type to String
- enter the full url including the http:// or https:// of the eth node in the value box with no leading/trailing whitespace
- Create the parameter

## Setting input variables

All the variables that must be set can be found in variables.tf
The table below was generated using terraform-docs: https://github.com/terraform-docs/terraform-docs

| Name                           | Description                                                                                       | Type                                                                                                                      | Default                                                                                                                                       | Required |
| ------------------------------ | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | :------: |
| app_name                       | The name of the application that will be used for tagging.                                        | `string`                                                                                                                  | `"local-graphnode-cluster"`                                                                                                                   |    no    |
| asg_details                    | How many of which instance type for the autoscailing group. Defaults to 1 t2.micro for free tier. | `object({instance_type = string, min_nodes = number, desired_nodes = number, max_nodes = number, storage_size = string})` | <pre>{<br> "desired_nodes": 1,<br> "instance_type": "t2.micro",<br> "max_nodes": 1,<br> "min_nodes": 1,<br> "storage_size": "15gb"<br>}</pre> |    no    |
| aws_keypair_name               | The name of the ssh keypair to use in order to allow access.                                      | `string`                                                                                                                  | n/a                                                                                                                                           |   yes    |
| ethnode_url_ssm_parameter_name | the name of an ssm parameter that holds the URL of the ethnode we will use                        | `string`                                                                                                                  | n/a                                                                                                                                           |   yes    |
| public_subnet_ids              | A list of public subnets in the vpc, if null use default vpc.                                     | `list(string)`                                                                                                            | `null`                                                                                                                                        |    no    |
| region                         | The aws region to deploy into.                                                                    | `string`                                                                                                                  | n/a                                                                                                                                           |   yes    |
| route53_root_fqdn              | Root route53 domain name that we should build records on top of.                                  | `string`                                                                                                                  | n/a                                                                                                                                           |   yes    |
| vpc_id                         | The VPC to deploy into, if null use default vpc.                                                  | `string`                                                                                                                  | `null`                                                                                                                                        |    no    |

NOTE: aws_keypair_name is the name of an ssh keypair created in the console here: https://console.aws.amazon.com/ec2/v2/home?region=us-east-1#KeyPairs:

NOTE: ethnode_url_ssm_parameter_name is name of the parameter you created above

NOTE: route53_root_fqdn must be set to the full domain name of a route53 zone in the same account. for example: example.com
In most other cases, the inputs/defaults are clear. You don't need to mess with vpc/subnet settings unless you've created a vpc other than the default one that came with the account.

Input variables can be set easily set in the following ways:

- You can create a file that ends in .tfvars in the same directory as the terraform code and set variables with syntax
  `this = that` and then use --var-file="filename" when running terraform. Note that if you call the file terraform.tfvars it will be read in by default. There is an example file.
- You can create environment variables named TF_ENV_variable_name and set them = to the values

You can mix and match based on requirements. Keys and senstive data are best passed as environment variables, everything else can go in a var file.
More details here: https://www.terraform.io/docs/configuration/variables.html

## Run terraform and test

Terraform code has changed between versions. The best way to run terraform is using a tool called tfenv. tfenv
automatically reads the .terraform-version file that exists in this repo and uses that version.
You can install tfenv following the instructions here:
https://github.com/tfutils/tfenv

Once you have that setup, in this directory run `tfenv install` to install the version specified.

Now run `terraform init` to connect to your s3 state bucket and download plugins and providers

After some text you should see "Terraform has been successfully initialized!"

You did all your s3 stuff right!

Lastly run `terraform apply` to print a infrastructure change plan and then ask approval to apply the changes.

NOTE: the `terraform apply` command is where you can specify --var-file if everything isn't in environment vars. You can run `terraform apply --help` to see all options

On running terraform apply lots of stuff should print out. You can scroll through and see the exact details of all the changes terraform plans to make to aws. When the plan is finished you should see something like:

```
Plan: 11 to add, 0 to change, 0 to destroy.

Changes to Outputs:
  + access_url = (known after apply)

Do you want to perform these actions?
  Terraform will perform the actions described above.
  Only 'yes' will be accepted to approve.

  Enter a value:
```

Note that the number to add may change a bit depending on your vpc config and changes to this project. Type yes and hit enter. It will now take about 10-20 minutes to build everything out on aws. Assuming there are no errors the output should end with something like this:

```
Apply complete! Resources: 11 added, 0 changed, 0 destroyed.
Releasing state lock. This may take a few moments...

Outputs:

access_url = "http://graphql.badger.vlk.berlin"
```

You should be able to click on the URL and get to the graphnode. You can reach the graphql interface for the badger subgraph by adding `/subgraphs/name/badger-subgraph` to the end of the stated url.

## Final Notes

In templates/userdata.sh.template you can find a bash script that will bring an amazon 2 linux instance up as a graph node. You can just scp it to an instance and run it if this is all too much for you. You will need to remove line 9 which is templatized and change ETHNODE_URL in line 10 to your ETHNODE_URL (or delete line 10 and export it before you run)
