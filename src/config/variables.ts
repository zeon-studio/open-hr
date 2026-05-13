const variables = {
  env: process.env.NODE_ENV,
  database_uri: process.env.MONGO_URI,
  salt: Number(process.env.SALT_ROUND || 10),
  jwt_secret: process.env.JWT_SECRET || process.env.NEXT_AUTH_SECRET || "",
  jwt_expire: process.env.JWT_TOKEN_EXPIRE || "7d",
  id_prefix: process.env.ID_GENERATOR_PREFIX,
  sender_email: process.env.SENDER_EMAIL,
  sender_password: process.env.EMAIL_PASSWORD,
  dos_public_access_key: process.env.DOS_PUBLIC_ACCESS_KEY,
  dos_public_secret_key: process.env.DOS_PUBLIC_SECRET_KEY,
  dos_bucket_name: process.env.DOS_BUCKET_NAME,
  dos_region: process.env.DOS_REGION,
  app_url: process.env.APP_URL,
  discord_webhook_url: process.env.DISCORD_WEBHOOK_URL,
};

export default variables;
