export default () => ({
  environment: process.env.NODE_ENV || 'development',
  apiKey: process.env.API_KEY,
  nanoid: process.env.NANOID_GEN,
  blobStorage: process.env.STORAGE_ACCOUNT_URL,
  development: {
    host: process.env.LOCAL_DATABASE_HOST,
    port: process.env.LOCAL_DATABASE_PORT,
    username: process.env.LOCAL_DATABASE_USER,
    password: process.env.LOCAL_DATABASE_PASSWORD,
    database: process.env.LOCAL_DATABASE_NAME,
    synchronize: Boolean(process.env.LOCAL_DATABASE_SYNCHRONIZATION),
    logging: Boolean(process.env.LOCAL_DATABASE_LOGGING),
    dialect: process.env.LOCAL_DATABASE_DIALECT,
    ssl: Boolean(process.env.LOCAL_DATABASE_SSL),
    autoLoadModels: Boolean(process.env.LOCAL_DATABASE_AUTOLOAD_MODELS),
    rejectUnauthorized: Boolean(process.env.LOCAL_DATABASE_REJECT_UNAUTHORIZED),
  },
  production: {
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT as any,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    synchronize: Boolean(process.env.DATABASE_SYNCHRONIZATION),
    logging: Boolean(process.env.DATABASE_LOGGING),
    dialect: process.env.DATABASE_DIALECT as any,
    ssl: Boolean(process.env.DATABASE_SSL),
    autoLoadModels: Boolean(process.env.DATABASE_AUTOLOAD_MODELS),
    rejectUnauthorized: Boolean(process.env.DATABASE_REJECT_UNAUTHORIZED),
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT),
    pass: process.env.REDIS_PASSWORD,
    auth: process.env.REDIS_AUTH,
  },
  sentry: {
    dns: process.env.SENTRY_DNS,
    enabled: process.env.SENTRY_ENABLED,
  },
  throttle: {
    ttl: process.env.THROTTLE_TTL,
    limit: process.env.THROTTLE_LIMIT,
  },
  jwt: {
    user: process.env.JWT_USER,
    admin: process.env.JWT_ADMIN,
    tokenAudience: process.env.JWT_TOKEN_AUDIENCE,
    tokenIssuer: process.env.JWT_TOKEN_ISSUER,
    jwtTtl: process.env.JWT_ACCESS_TOKEN_TTL,
    refreshTokenTtl: process.env.JWT_REFRESH_TOKEN_TTL,
  },
  mail: {
    host: process.env.MAIL_HOST,
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
    from: process.env.MAIL_FROM,
  },
  seeding: {
    email1: process.env.SEEDING_EMAIL1,
    email2: process.env.SEEDING_EMAIL2,
    pass1: process.env.SEEDING_PASS1,
    pass2: process.env.SEEDING_PASS2,
  },
  script: {
    dev: 'NODE_ENV=dev nest start --watch',
  },
});
