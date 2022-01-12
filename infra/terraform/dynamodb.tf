resource "aws_dynamodb_table" "tap_orders_tag_service_dynamodb_table" {
  name           = local.app_name_construct
  billing_mode   = "PAY_PER_REQUEST"
  read_capacity  = 0
  write_capacity = 0
  hash_key       = "order_id"

  attribute {
    name = "order_id"
    type = "S"
  }
  point_in_time_recovery {
    enabled = false
  }

  tags = local.common_tags
}

data "aws_iam_policy_document" "dynamodb_iam_user_policy" {
  statement {
    actions = [
      "dynamodb:BatchGetItem",
      "dynamodb:GetItem",
      "dynamodb:Query",
      "dynamodb:Scan",
      "dynamodb:BatchWriteItem",
      "dynamodb:PutItem",
      "dynamodb:UpdateItem",
      "dynamodb:Delete*",
    ]

    resources = [
      aws_dynamodb_table.tap_orders_tag_service_dynamodb_table.arn,
    ]
  }
}

resource "aws_iam_user_policy" "dynamodb_policy" {
  name   = "${local.app_name_construct}-dynamodb"
  user   = aws_iam_user.tap_user.name
  policy = data.aws_iam_policy_document.dynamodb_iam_user_policy.json
}