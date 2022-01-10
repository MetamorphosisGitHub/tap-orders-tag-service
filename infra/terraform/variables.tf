variable "aws_region" {
  type = string
}

variable "environment" {
  type        = string
  description = "Long name of the environment."

  validation {
    condition     = contains(["beta", "production", "develop"], var.environment)
    error_message = "The long name of the environment must be one of 'beta', 'production' or 'develop'."
  }
}

variable "environment_short" {
  type        = string
  description = "Short name of the environment."

  validation {
    condition     = contains(["bta", "prd", "dev"], var.environment_short)
    error_message = "The short name of the environment must be one of 'bta', 'prd' or 'dev'."
  }
}