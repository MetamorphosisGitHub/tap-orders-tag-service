terraform {
  backend "remote" {
    organization = "metamorphosis"

    workspaces {
      prefix = "tap-orders-tag-service-"
    }
  }
}

provider "aws" {
  region = var.aws_region
}
data "aws_region" "current" {}

locals {
  project_name = "tap-orders-tag-service"

  app_name_construct = "${local.project_name}-${var.environment_short}"

  common_tags = {
    Environment             = var.environment
    ProjectName             = local.project_name
    TerraformCloudWorkspace = "metamorphosis/tap-orders-tag-service-${var.environment_short}"
  }
}