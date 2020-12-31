provider "aws" {
  region = local.region
}
terraform {
  backend "s3" {
    bucket         = "tfstate-vlk-badger" ##TODO change to the name of the terraform bucket created
    key            = "badger-graphnode/main.tfstate"
    dynamodb_table = "tfstate-locking"
  }
}
