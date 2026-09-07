terraform {
  backend "s3" {
    bucket = "foodie-we-terraform-state-395063533284"
    key    = "foodie-we/dev/terraform.tfstate"
    region = "us-west-2"
  }
}
