resource "aws_iam_user" "tap_user" {
  name = local.app_name_construct
  tags = local.common_tags
}

resource "aws_iam_access_key" "tap_user" {
  user = aws_iam_user.tap_user.name
}

resource "aws_secretsmanager_secret" "tap_user" {
  name = "${local.app_name_construct}/${var.environment_short}"
  tags = local.common_tags
}

resource "aws_secretsmanager_secret_version" "tap_user" {
  secret_id = aws_secretsmanager_secret.tap_user.id
  secret_string = jsonencode({
    access_key        = aws_iam_access_key.tap_user.id
    access_secret_key = aws_iam_access_key.tap_user.secret
  })
}