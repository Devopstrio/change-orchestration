provider "aws" {
  region = var.region
}

# Remote State Backend (S3 + DynamoDB)
terraform {
  backend "s3" {
    bucket         = "devopstrio-terraform-state"
    key            = "change-orchestration/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "terraform-locks"
    encrypt        = true
  }
}

# Networking Module
module "vpc" {
  source = "./modules/networking"
  cidr_block = "10.0.0.0/16"
  environment = var.environment
}

# EKS Cluster Module
module "eks" {
  source = "./modules/eks"
  vpc_id = module.vpc.vpc_id
  subnet_ids = module.vpc.private_subnet_ids
  cluster_name = "change-orchestration-${var.environment}"
}

# RDS Database
module "rds" {
  source = "./modules/rds"
  vpc_id = module.vpc.vpc_id
  subnet_ids = module.vpc.private_subnet_ids
  db_name = "change_db"
}

# Redis for Task Queueing
module "redis" {
  source = "./modules/redis"
  vpc_id = module.vpc.vpc_id
  subnet_ids = module.vpc.private_subnet_ids
}
